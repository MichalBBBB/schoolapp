import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../utils/MyContext";
import { queueMap } from "..";

export class DefferedObject {
  public resolve = (_value: any) => {};
  public promise: Promise<any> | null = null;
  constructor() {
    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
}

export const queueMiddleware: MiddlewareFn<MyContext> = async (
  { context },
  next
) => {
  const userId = context.payload?.userId;
  // Cehck if user is signed in
  if (userId) {
    console.log("operationStart", new Date());
    // If there is no queue yet for this user, create it
    if (!queueMap.get(userId)) {
      queueMap.set(userId, []);
    }
    // Create on object that allows other operations to trigger the start of this one
    const resolveObject = new DefferedObject();
    var result;
    var error;
    // Add this operation to the queue of this user
    queueMap
      .get(userId)
      ?.push({ req: context.req.body.operationName, resolveObject });
    console.log(queueMap);
    // If there is no other operation in the queue, start executing this one
    if (queueMap.get(userId)?.length == 1) {
      console.log("start operation");
      // we use this try catch block to allow the rest of the code to run,
      // even if the next() promise rejects and we throw the error at the end
      try {
        await new Promise((r) => setTimeout(r, 2000));
        result = await next();
      } catch (e) {
        error = e;
      }
    } else {
      // If there are other operations, wait until the previous operation triggers
      // the resolve function of the deffered object of this operation

      await resolveObject.promise;
      try {
        result = await next();
      } catch (e) {
        error = e;
      }
    }
    // Remove the current operation after completion
    queueMap.get(userId)?.shift();

    // If there are more operations in the queue, trigger the next one
    if (queueMap.get(userId)!.length > 0) {
      queueMap.get(userId)![0].resolveObject.resolve(null);
    }
    console.log("operationEnd", new Date());
    if (error) {
      throw error;
    } else {
      return result;
    }
  } else {
    throw new Error("user is not signed in");
  }
};
