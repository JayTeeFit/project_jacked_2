import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import env from "src/config/environment";

export default class JWTUtils {
  static generateAccessToken(payload: JwtPayload, options: SignOptions) {
    const { expiresIn = "1d" } = options;
    return jwt.sign(payload, env.jwtAccessTokenSecret, { expiresIn });
  }

  static generateRefreshToken(payload: JwtPayload) {
    return jwt.sign(payload, env.jwtRefreshTokenSecret);
  }

  static verifyAccessToken(accessToken: string) {
    return jwt.verify(accessToken, env.jwtAccessTokenSecret);
  }

  static verifyRefreshToken(accessToken: string) {
    return jwt.verify(accessToken, env.jwtRefreshTokenSecret);
  }
}
