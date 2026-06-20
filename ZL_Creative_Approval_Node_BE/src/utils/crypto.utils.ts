import crypto from "crypto";
import argon2 from "argon2";

export class CryptoUtil {
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, { type: argon2.argon2id });
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }

  hashToken(raw: string): string {
    return crypto.createHash("sha256").update(raw).digest("hex");
  }

  generateOpaqueToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  generateFamilyId(): string {
    return crypto.randomUUID();
  }
}
