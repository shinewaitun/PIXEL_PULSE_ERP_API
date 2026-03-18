import { Test, TestingModule } from '@nestjs/testing';
import { PasswordUtil, encryptData, decryptData } from '.';

describe('PasswordUtil', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  describe('PasswordUtil.hashPassword', () => {
    it('should hash a password', () => {
      const password = 'testPassword123';
      const hashed = PasswordUtil.hashPassword(password);

      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
      expect(hashed.split(':')).toHaveLength(3);
    });

    it('should hash different passwords differently', () => {
      const password1 = 'password1';
      const password2 = 'password2';

      const hash1 = PasswordUtil.hashPassword(password1);
      const hash2 = PasswordUtil.hashPassword(password2);

      expect(hash1).not.toBe(hash2);
    });

    it('should hash the same password differently each time (due to salt)', () => {
      const password = 'samePassword';
      const hash1 = PasswordUtil.hashPassword(password);
      const hash2 = PasswordUtil.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('PasswordUtil.verifyPassword', () => {
    it('should verify correct password', () => {
      const password = 'correctPassword123';
      const hashed = PasswordUtil.hashPassword(password);

      const isValid = PasswordUtil.verifyPassword(password, hashed);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', () => {
      const correctPassword = 'correctPassword123';
      const wrongPassword = 'wrongPassword123';
      const hashed = PasswordUtil.hashPassword(correctPassword);

      const isValid = PasswordUtil.verifyPassword(wrongPassword, hashed);
      expect(isValid).toBe(false);
    });

    it('should handle invalid hash format gracefully', () => {
      const password = 'testPassword';
      const invalidHash = 'invalid:hash:format';

      const isValid = PasswordUtil.verifyPassword(password, invalidHash);
      expect(isValid).toBe(false);
    });
  });

  describe('PasswordUtil.generateToken', () => {
    it('should generate a token of specified length', () => {
      const length = 16;
      const token = PasswordUtil.generateToken(length);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(length * 2); // hex encoding doubles the length
    });

    it('should generate different tokens each time', () => {
      const token1 = PasswordUtil.generateToken();
      const token2 = PasswordUtil.generateToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('PasswordUtil.hashData', () => {
    it('should hash data consistently', () => {
      const data = 'test data for hashing';
      const hash1 = PasswordUtil.hashData(data);
      const hash2 = PasswordUtil.hashData(data);

      expect(hash1).toBeDefined();
      expect(typeof hash1).toBe('string');
      expect(hash1).toBe(hash2); // Same input should produce same hash
    });

    it('should hash different data differently', () => {
      const data1 = 'data1';
      const data2 = 'data2';

      const hash1 = PasswordUtil.hashData(data1);
      const hash2 = PasswordUtil.hashData(data2);

      expect(hash1).not.toBe(hash2);
    });
  });
});

describe('encryptData and decryptData', () => {
  describe('encryptData', () => {
    it('should encrypt string data', () => {
      const data = 'test data';
      const encrypted = encryptData(data);

      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toBe(data);
    });

    it('should encrypt object data', () => {
      const data = { key: 'value', number: 123 };
      const encrypted = encryptData(data);

      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe('string');
    });

    it('should return null for falsy input', () => {
      expect(encryptData(null)).toBeNull();
      expect(encryptData(undefined)).toBeNull();
      expect(encryptData('')).toBeNull();
    });
  });

  describe('decryptData', () => {
    it('should decrypt string data', () => {
      const originalData = 'test data';
      const encrypted = encryptData(originalData);
      const decrypted = decryptData(encrypted!);

      expect(decrypted).toBe(originalData);
    });

    it('should decrypt object data', () => {
      const originalData = { key: 'value', number: 123 };
      const encrypted = encryptData(originalData);
      const decrypted = decryptData(encrypted!);

      expect(decrypted).toEqual(originalData);
    });

    it('should return null for falsy input', () => {
      expect(decryptData(null!)).toBeNull();
      expect(decryptData(undefined!)).toBeNull();
      expect(decryptData('')).toBeNull();
    });

    it('should return null for invalid encrypted data', () => {
      const invalidEncrypted = 'invalid-encrypted-data';
      const decrypted = decryptData(invalidEncrypted);

      expect(decrypted).toBeNull();
    });
  });

  describe('encryptData and decryptData integration', () => {
    it('should encrypt and decrypt various data types correctly', () => {
      const testCases = [
        'simple string',
        { user: 'john', age: 30 },
        [1, 2, 3, 'test'],
        { nested: { object: { with: 'values' } } },
      ];

      testCases.forEach((testData) => {
        const encrypted = encryptData(testData);
        const decrypted = decryptData(encrypted!);

        expect(decrypted).toEqual(testData);
      });
    });
  });
});
