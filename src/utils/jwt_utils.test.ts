import jwt, { JwtPayload } from "jsonwebtoken";
import JWTUtils from "src/utils/jwt_utils";

describe("jwt utils", () => {
  it("should return an access token", () => {
    const payload: JwtPayload = { email: "test@example.com" };
    expect(JWTUtils.generateAccessToken(payload, {})).toEqual(
      expect.any(String)
    );
  });

  it("should return an access token", () => {
    const payload: JwtPayload = { email: "test@example.com" };
    expect(JWTUtils.generateRefreshToken(payload)).toEqual(expect.any(String));
  });

  it("should verify that the access token is valid", () => {
    const payload: JwtPayload = { email: "test@example.com" };
    const jwt: string = JWTUtils.generateAccessToken(payload, {});
    expect(JWTUtils.verifyAccessToken(jwt)).toEqual(
      expect.objectContaining(payload)
    );
  });

  it("should verify that the refresh token is valid", () => {
    const payload: JwtPayload = { email: "test@example.com" };
    const jwt: string = JWTUtils.generateRefreshToken(payload);
    expect(JWTUtils.verifyRefreshToken(jwt)).toEqual(
      expect.objectContaining(payload)
    );
  });

  it("should error if the access token is invalid", () => {
    expect(() => JWTUtils.verifyAccessToken("invalid.token")).toThrow(
      jwt.JsonWebTokenError
    );
  });

  it("should error if the access token is invalid", () => {
    expect(() => JWTUtils.verifyRefreshToken("invalid.token")).toThrow(
      jwt.JsonWebTokenError
    );
  });
});
