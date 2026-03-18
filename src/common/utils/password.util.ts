import CryptoJS from 'crypto-js';

const SECRET_KEY =
  process.env.ENCRYPTION_SECRET_KEY ||
  'default-secret-key-change-in-production';

export function encryptData(
  data: object | string | null | undefined,
): string | null {
  if (data === null || data === undefined || data === '') return null;

  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted || null;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Encryption failed:', errorMessage);
    return null;
  }
}

export function decryptData(ciphertext: string): object | string | null {
  if (!ciphertext) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) return null;

    return JSON.parse(decrypted) as object | string;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to decrypt data:', errorMessage);
    return null;
  }
}

export class PasswordUtil {
  static hashPassword(password: string, saltRounds = 12): string {
    const salt = CryptoJS.lib.WordArray.random(16).toString();
    const hash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: saltRounds,
    }).toString();
    return `${salt}:${saltRounds}:${hash}`;
  }

  static verifyPassword(password: string, hashedPassword: string): boolean {
    if (!hashedPassword || !hashedPassword.includes(':')) return false;
    try {
      const [salt, saltRoundsStr, hash] = hashedPassword.split(':');
      const saltRounds = parseInt(saltRoundsStr, 10);
      const computedHash = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: saltRounds,
      }).toString();
      return hash === computedHash;
    } catch {
      return false;
    }
  }

  static generateToken(length = 32): string {
    return CryptoJS.lib.WordArray.random(length).toString();
  }

  static hashData(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }
}
