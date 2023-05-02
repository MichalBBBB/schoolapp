import { UserError } from "../generated/graphql";

export const toErrorMap = (errors: UserError[]) => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    if (field) {
      errorMap[field] = message;
    }
  });

  return errorMap;
};
