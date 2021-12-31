import { User } from "src/entities/User";
import { sign } from "jsonwebtoken";
import { Response } from "express";

export const createAccesToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCES_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("jid", token, {
    httpOnly: true,
    path: "/refresh_token",
  });
};

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}

export interface AccesTokenPayload {
  userId: string;
}
