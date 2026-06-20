import jwt from "jsonwebtoken";
import { config } from "../config/config";

export interface AccessTokenPayload {
  sub: string;
  sid: string;
  tv: number;
  iat?: number;
  exp?: number;
}

export class JwtUtil {
  signAccessToken(payload: {
    userId: string;
    sessionFamilyId: string;
    tokenVersion: number;
  }): string {
    return jwt.sign(
      {
        sub: payload.userId,
        sid: payload.sessionFamilyId,
        tv: payload.tokenVersion,
      },
      config.auth.jwtPrivateKey,
      {
        algorithm: "RS256",
        expiresIn: config.auth.jwtAccessTtlSeconds,
        keyid: config.auth.jwtKeyId,
      },
    );
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, config.auth.jwtPublicKey, {
      algorithms: ["RS256"],
    }) as AccessTokenPayload;
  }
}
