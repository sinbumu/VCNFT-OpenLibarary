import crypto from 'crypto';

export class HashUtils {
  public static computeSHA256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  public static computeSHA512(data: string): string {
    return crypto.createHash('sha512').update(data).digest('hex');
  }

  public static generateRandomHex(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }
}
