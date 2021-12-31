import { User } from "../entities/User";
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import argon2 from "argon2";
import {
  createAccesToken,
  createRefreshToken,
  sendRefreshToken,
} from "../utils/authUtils";
import { MyContext } from "../utils/MyContext";
import { validateRegister } from "../utils/validateRegister";
import { getConnection } from "typeorm";

@ObjectType()
export class UserError {
  @Field({ nullable: true })
  field?: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [UserError], { nullable: true })
  errors?: UserError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  accesToken?: string;
}

@Resolver(User)
export class userResolver {
  // Login mutation
  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email } });
    // Check if user exists
    if (!user) {
      return {
        errors: [
          { field: "email", message: "User with that email doesn't exist" },
        ],
      };
    }
    // Verify password
    const valid = argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [{ field: "password", message: "Incorrect password" }],
      };
    }
    // Send refresh token cookie
    sendRefreshToken(res, createRefreshToken(user));

    return {
      user: user,
      accesToken: createAccesToken(user),
    };
  }

  // Register mutation
  @Mutation(() => UserResponse)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("name") name: string,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(email, password);
    if (errors) {
      return {
        errors,
      };
    }

    const hashedPassword = await argon2.hash(password);

    let user;

    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({ email, password: hashedPassword, fullName: name })
        .returning("*")
        .execute();

      user = result.raw[0];
    } catch (err) {
      // Catch postgres error about broken unique contstraint on email
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "email",
              message: "User with that email already exists",
            },
          ],
        };
      }
    }
    // Send refresh token cookie
    sendRefreshToken(res, createRefreshToken(user));
    return {
      user,
      accesToken: createAccesToken(user),
    };
  }
}
