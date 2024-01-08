import { MiddlewareFn } from "type-graphql";
export const ErrorInterceptor: MiddlewareFn<any> = async (_, next) => {
  try {
    return await next();
  } catch (err) {
    console.log(JSON.stringify(err));

    // rethrow the error
    throw err;
  }
};
