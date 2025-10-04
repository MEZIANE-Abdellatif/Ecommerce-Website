const nodemailer = require('nodemailer');

// Create transporter function
const createTransporter = () => {
  // Check if we have Gmail credentials
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Use Gmail SMTP with environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    return transporter;
  } else {
    // Fallback to console-based email verification for development
    console.log('⚠️  No email credentials found. Using console-based email verification for development.');
    
    // Create a mock transporter that logs instead of sending
    return {
      sendMail: async (mailOptions) => {
        const verificationUrl = mailOptions.html.match(/href="([^"]+)"/)?.[1] || 'No URL found';
        
        console.log('\n📧 === EMAIL VERIFICATION ===');
        console.log('📧 To:', mailOptions.to);
        console.log('📧 Subject:', mailOptions.subject);
        console.log('📧 Verification URL:', verificationUrl);
        console.log('📧 Copy this URL and paste it in your browser to verify your email');
        console.log('📧 ============================\n');
        
        return {
          messageId: 'mock-message-id',
          response: 'Email logged to console'
        };
      }
    };
  }
};

// Send verification email
const sendVerificationEmail = async (email, name, verificationToken) => {
  const transporter = createTransporter();
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5175'}/verify-email?token=${verificationToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@mazzinka.com',
    to: email,
    subject: 'Welcome to Mazzinka - Verify Your Email',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #fce7f3 100%);">
        <!-- Header with MaZzinka Branding -->
        <div style="background: linear-gradient(135deg, #ec4899 0%, #be185d 50%, #e11d48 100%); color: white; padding: 30px; text-align: center; border-radius: 16px 16px 0 0; box-shadow: 0 8px 32px rgba(236, 72, 153, 0.3);">
          <h1 style="margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 2px; margin-bottom: 10px;">MaZzinka</h1>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">Premium Beauty & Cosmetics</p>
        </div>
        
        <!-- Main Content -->
        <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 24px; font-weight: 700;">Hello ${name}! ✨</h2>
          
          <p style="color: #4b5563; line-height: 1.7; margin-bottom: 25px; font-size: 16px;">
            Welcome to the world of premium beauty! We're thrilled to have you join our community of beauty enthusiasts. 
            To complete your registration and unlock access to our exclusive collection, please verify your email address.
          </p>
          
          <!-- Verification Button -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #ec4899 0%, #be185d 50%, #e11d48 100%); 
                      color: white; padding: 16px 40px; text-decoration: none; 
                      border-radius: 12px; display: inline-block; font-weight: 700; font-size: 16px;
                      box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4); transition: all 0.3s ease;">
              ✨ Verify My Email ✨
            </a>
          </div>
          
          <!-- Alternative Link -->
          <div style="background: #fdf2f8; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #ec4899;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">
              Button not working? Copy and paste this link:
            </p>
            <p style="color: #ec4899; font-size: 14px; word-break: break-all; background: white; padding: 10px; border-radius: 8px; margin: 0; font-family: monospace;">
              ${verificationUrl}
            </p>
          </div>
          
          <!-- Additional Info -->
          <div style="background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%); padding: 20px; border-radius: 12px; margin-top: 25px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.6;">
              <strong>⏰ Important:</strong> This verification link will expire in 24 hours.<br>
              <strong>🔒 Security:</strong> If you didn't create an account with MaZzinka, you can safely ignore this email.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding: 20px;">
          <div style="margin-bottom: 15px;">
            <span style="color: #ec4899; font-size: 20px; font-weight: 800; letter-spacing: 2px;">MaZzinka</span>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
            Premium Beauty & Cosmetics
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
            © 2024 MaZzinka. All rights reserved.
          </p>
          <div style="margin-top: 15px;">
            <a href="#" style="color: #ec4899; text-decoration: none; font-size: 12px; margin: 0 10px;">Privacy Policy</a>
            <a href="#" style="color: #ec4899; text-decoration: none; font-size: 12px; margin: 0 10px;">Terms of Service</a>
            <a href="#" style="color: #ec4899; text-decoration: none; font-size: 12px; margin: 0 10px;">Contact Us</a>
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    // If using console-based verification, show the URL clearly
    if (!process.env.EMAIL_USER) {
      console.log('\n🔗 VERIFICATION LINK FOR TESTING:');
      console.log(verificationUrl);
      console.log('\n📋 Copy and paste this URL in your browser to verify your email\n');
    }
    
    return info;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = {
  sendVerificationEmail,
}; 