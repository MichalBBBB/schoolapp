import { UserError } from "../types/userResponseTypes";

// TODO - fix validation

export const validateRegister = (
  email: string,
  password: string
): UserError[] | null => {
  if (!email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }

  if (password.length <= 2) {
    return [
      {
        field: "password",
        message: "length must be greater than 2",
      },
    ];
  }

  return null;
};
