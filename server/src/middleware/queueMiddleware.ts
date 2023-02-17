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
    // Add this operation to the queue of this user
    queueMap
      .get(userId)
      ?.push({ req: context.req.body.operationName, resolveObject });
    // If there is no other operation in the queue, start executing this one
    if (queueMap.get(userId)?.length == 1) {
      result = await next();
    } else {
      // If there are other operations, wait until the previous operation triggers
      // the resolve function of the deffered object of this operation
      await resolveObject.promise;
      result = await next();
    }
    // Remove the current operation after completion
    queueMap.get(userId)?.shift();

    // If there are more operations in the queue, trigger the next one
    if (queueMap.get(userId)!.length > 0) {
      queueMap.get(userId)![0].resolveObject.resolve(null);
    }
    console.log("operationEnd", new Date());
    return result;
  } else {
    throw new Error("user is not signed in");
  }
};
