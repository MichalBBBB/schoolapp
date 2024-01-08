import { ObjectType, Field, createUnionType } from "type-graphql";
import { User } from "../entities/User";

@ObjectType()
export class UserError {
  @Field({ nullable: true })
  field?: "email" | "password";

  @Field()
  message: string;
}

@ObjectType()
export class UserFail {
  @Field(() => [UserError])
  errors: UserError[];
}

@ObjectType()
export class UserSuccess {
  @Field(() => User)
  user: User;

  @Field()
  accessToken: string;
}

@ObjectType()
export class ChangePasswordSuccess {
  @Field()
  changePassword: Boolean;
}

@ObjectType()
export class ForgotPasswordSuccess {
  @Field()
  forgotPassword: Boolean;
}

export const RegisterUnion = createUnionType({
  name: "RegisterResponse",
  types: () => [UserSuccess, UserFail] as const,
  resolveType: (value) => {
    if ("user" in value) {
      return UserSuccess;
    } else {
      return UserFail;
    }
  },
});

export const LoginUnion = createUnionType({
  name: "LoginResponse",
  types: () => [UserSuccess, UserFail] as const,
  resolveType: (value) => {
    if ("user" in value) {
      return UserSuccess;
    } else {
      return UserFail;
    }
  },
});

export const ChangePasswordUnion = createUnionType({
  name: "ChangePasswordResponse",
  types: () => [ChangePasswordSuccess, UserFail] as const,
  resolveType: (value) => {
    if ("errors" in value) {
      return UserFail;
    } else {
      return ChangePasswordSuccess;
    }
  },
});

export const ForgotPasswordUnion = createUnionType({
  name: "ForgotPasswordResponse",
  types: () => [ForgotPasswordSuccess, UserFail] as const,
  resolveType: (value) => {
    if ("errors" in value) {
      return UserFail;
    } else {
      return ForgotPasswordSuccess;
    }
  },
});
