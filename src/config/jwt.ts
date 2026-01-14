import "dotenv/config";
import * as jwt from "jsonwebtoken";

const generateAccessToken = (email: string) => {
  const result = jwt.sign({ data: email }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });

  return result;
};

const generateRefreshToken = (email: string) => {
  const result = jwt.sign({ data: email }, process.env.REFRESH_TOKEN_SECRET!);

  return result;
};

export { generateAccessToken, generateRefreshToken };
