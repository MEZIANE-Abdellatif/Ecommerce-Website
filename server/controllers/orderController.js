const Order = require('../models/Order');

// Guard must run before require('stripe')(...) — Stripe throws first if key is missing/empty
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create new order
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingMethod,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      shippingMethod,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get logged in user orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete order by ID (admin only)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createPaymentIntent = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ownership check — req.user._id because protect sets full user document
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    // Convert PLN to grosz (Stripe smallest unit)
    const amount = Math.round(order.totalPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'pln',
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: order._id.toString() },
    });

    // Return ONLY clientSecret — never the full PaymentIntent object
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    // Log full error server-side only — never expose Stripe internals
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ message: 'Payment initialization failed' });
  }
};

const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    // Signature invalid — log server side, return 400
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send('Webhook signature verification failed');
  }

  // Note: No JWT auth on this endpoint — Stripe signature IS the auth mechanism

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const intent = event.data.object;
      const orderId = intent.metadata?.orderId;

      if (!orderId) {
        console.warn('Webhook: payment_intent.succeeded missing orderId in metadata');
        return res.status(200).json({ received: true });
      }

      const order = await Order.findById(orderId);

      if (!order) {
        console.warn(`Webhook: order ${orderId} not found in DB`);
        return res.status(200).json({ received: true });
      }

      // Idempotency guard — Stripe may retry the same event
      if (order.isPaid) {
        return res.status(200).json({ received: true });
      }

      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: intent.id,
        status: intent.status,
        update_time: new Date(intent.created * 1000).toISOString(),
        email_address: intent.receipt_email || '',
        payment_intent_id: intent.id,
        payment_method_type: intent.payment_method_types?.[0] || '',
        amount_received: intent.amount_received,
      };

      await order.save();
      console.log(`✅ Webhook: order ${orderId} marked as paid`);
      return res.status(200).json({ received: true });
    }

    default:
      // Unhandled event — return 200 so Stripe does not retry
      return res.status(200).json({ received: true });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getMyOrders,
  deleteOrder,
  createPaymentIntent,
  stripeWebhook,
}; 