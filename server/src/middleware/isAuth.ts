import { verify } from "jsonwebtoken";
import { AccesTokenPayload } from "src/utils/authUtils";
import { MyContext } from "src/utils/MyContext";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  console.log(authorization);
  if (!authorization) {
    throw new Error("not authenticated");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.ACCES_TOKEN_SECRET!);
    context.payload = payload as AccesTokenPayload;
  } catch (err) {
    throw new Error("not authenticated");
  }

  return next();
};
