import { Request, Response } from "express";
import { RedisClientType } from "redis";

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { userId: string };
  redis: RedisClientType<any>;
}
