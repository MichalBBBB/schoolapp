import { User } from "src/entities/User";
import { sign } from "jsonwebtoken";
import { Response } from "express";
import dayjs from "dayjs";
import axios from "axios";

export const createAccesToken = async (user: User) => {
  let result;
  try {
    result = await axios(
      `https://api.revenuecat.com/v1/subscribers/${user.id}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${process.env.RVC_API_KEY}`,
        },
      }
    );
    console.log(result.data.subscriber);
  } catch (err) {
    console.log(err);
  }

  return sign(
    {
      userId: user.id,
      entitlements: result
        ? Object.keys(result.data.subscriber.entitlements)
        : undefined,
    } as AccesTokenPayload,
    process.env.ACCES_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    }
  );
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
    expires: dayjs().add(7, "day").toDate(),
  });
};

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}

export interface AccesTokenPayload {
  userId: string;
  entitlements: string[] | undefined;
}
