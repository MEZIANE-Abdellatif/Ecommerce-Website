import { deriveAddressParts, formatPostalCode, validatePostalCode } from './addressUtils';

describe('addressUtils', () => {
  describe('deriveAddressParts', () => {
    it('should extract street line from house_number and road', () => {
      const suggestion = {
        address: {
          house_number: '123',
          road: 'Main Street',
          city: 'Warsaw',
          state: 'Mazowieckie',
          postcode: '00-001',
          country: 'Poland',
          country_code: 'pl'
        },
        lat: '52.2297',
        lon: '21.0122'
      };

      const result = deriveAddressParts(suggestion);

      expect(result.streetLine).toBe('123 Main Street');
      expect(result.city).toBe('Warsaw');
      expect(result.state).toBe('Mazowieckie');
      expect(result.postcode).toBe('00-001');
      expect(result.country).toBe('Poland');
      expect(result.countryCode).toBe('PL');
      expect(result.lat).toBe(52.2297);
      expect(result.lon).toBe(21.0122);
    });

    it('should handle missing house_number', () => {
      const suggestion = {
        address: {
          road: 'Main Street',
          city: 'Warsaw'
        }
      };

      const result = deriveAddressParts(suggestion);
      expect(result.streetLine).toBe('Main Street');
    });

    it('should use alternative city fields', () => {
      const suggestionWithTown = {
        address: {
          town: 'Krakow'
        }
      };
      expect(deriveAddressParts(suggestionWithTown).city).toBe('Krakow');

      const suggestionWithVillage = {
        address: {
          village: 'Zakopane'
        }
      };
      expect(deriveAddressParts(suggestionWithVillage).city).toBe('Zakopane');
    });

    it('should handle empty or invalid input', () => {
      const result = deriveAddressParts(null);
      expect(result.streetLine).toBe('');
      expect(result.city).toBe('');
      expect(result.lat).toBeNull();
    });
  });

  describe('formatPostalCode', () => {
    it('should format Polish postal codes', () => {
      expect(formatPostalCode('00001', 'PL')).toBe('00-001');
      expect(formatPostalCode('12345', 'PL')).toBe('12-345');
      expect(formatPostalCode('00-001', 'PL')).toBe('00-001');
    });

    it('should format Moroccan postal codes', () => {
      expect(formatPostalCode('20000', 'MA')).toBe('20000');
      expect(formatPostalCode('200001', 'MA')).toBe('20000'); // Limit to 5 digits
    });

    it('should handle partial input', () => {
      expect(formatPostalCode('123', 'PL')).toBe('123');
      expect(formatPostalCode('12', 'MA')).toBe('12');
    });

    it('should handle empty input', () => {
      expect(formatPostalCode('', 'PL')).toBe('');
      expect(formatPostalCode('', 'MA')).toBe('');
    });

    it('should remove non-numeric characters', () => {
      expect(formatPostalCode('abc123def', 'PL')).toBe('123');
      expect(formatPostalCode('12-34-5', 'PL')).toBe('12-345');
    });
  });

  describe('validatePostalCode', () => {
    it('should validate Polish postal codes', () => {
      expect(validatePostalCode('00-001', 'PL')).toEqual({ valid: true, message: '' });
      expect(validatePostalCode('12-345', 'PL')).toEqual({ valid: true, message: '' });
      
      const invalid = validatePostalCode('12345', 'PL');
      expect(invalid.valid).toBe(false);
      expect(invalid.message).toContain('NN-NNN');
    });

    it('should validate Moroccan postal codes', () => {
      expect(validatePostalCode('20000', 'MA')).toEqual({ valid: true, message: '' });
      expect(validatePostalCode('12345', 'MA')).toEqual({ valid: true, message: '' });
      
      const invalid = validatePostalCode('1234', 'MA');
      expect(invalid.valid).toBe(false);
      expect(invalid.message).toContain('5 digits');
    });

    it('should accept empty values', () => {
      expect(validatePostalCode('', 'PL')).toEqual({ valid: true, message: '' });
      expect(validatePostalCode('', 'MA')).toEqual({ valid: true, message: '' });
    });

    it('should validate other countries without error', () => {
      expect(validatePostalCode('12345', 'US')).toEqual({ valid: true, message: '' });
      expect(validatePostalCode('ABC 123', 'GB')).toEqual({ valid: true, message: '' });
    });
  });
});


