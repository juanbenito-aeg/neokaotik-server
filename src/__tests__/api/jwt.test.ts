import { MOCKED_PLAYER } from "../../__mocks__/mocked-player";
import { app } from "../../config/server";
import { jwtServices } from "../../services/jwt.services";
import request from "supertest";

const JWT_REFRESH_ROUTE = "/jwt/refresh";

describe(`GET ${JWT_REFRESH_ROUTE}`, () => {
  it("should answer with new access & refresh tokens if data sent from client side is valid", async () => {
    const mockedPlayerEmail = MOCKED_PLAYER.email;

    const validRefreshToken =
      jwtServices.generateRefreshToken(mockedPlayerEmail);

    const response = await request(app)
      .get(JWT_REFRESH_ROUTE)
      .set("Authorization", `Bearer ${validRefreshToken}`);

    expect(response.statusCode).toBe(200);

    const { accessToken, refreshToken } = response.body;

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it("should answer with 401 Unauthorized error if no refresh token is sent from client side", async () => {
    const response = await request(app).get(JWT_REFRESH_ROUTE);

    expect(response.statusCode).toBe(401);
  });

  it("should answer with 403 Forbidden error if data sent from client side is invalid", async () => {
    const invalidRefreshToken = "X";

    const response = await request(app)
      .get(JWT_REFRESH_ROUTE)
      .set("Authorization", `Bearer ${invalidRefreshToken}`);

    expect(response.statusCode).toBe(403);
  });
});
