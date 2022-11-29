import { User } from "../entities/User";
import {
  Arg,
  createUnionType,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import argon2 from "argon2";
import {
  createAccesToken,
  createRefreshToken,
  sendRefreshToken,
} from "../utils/authUtils";
import { MyContext } from "../utils/MyContext";
import { validateRegister } from "../utils/validateRegister";
import { getConnection } from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { Task } from "../entities/Task";
import { Subject } from "../entities/Subject";

@ObjectType()
export class UserError {
  @Field({ nullable: true })
  field?: "email" | "password";

  @Field()
  message: string;
}

@ObjectType()
class UserFail {
  @Field(() => [UserError])
  errors: UserError[];
}

@ObjectType()
class UserSucces {
  @Field(() => User)
  user: User;

  @Field()
  accesToken: string;
}

const RegisterUnion = createUnionType({
  name: "RegisterResponse",
  types: () => [UserSucces, UserFail] as const,
  resolveType: (value) => {
    if ("user" in value) {
      return UserSucces;
    } else {
      return UserFail;
    }
  },
});

const LoginUnion = createUnionType({
  name: "LoginResponse",
  types: () => [UserSucces, UserFail] as const,
  resolveType: (value) => {
    if ("user" in value) {
      return UserSucces;
    } else {
      return UserFail;
    }
  },
});

@Resolver(User)
export class userResolver {
  // !!!! Remove !!!!
  @Query(() => [User])
  getAllUsers() {
    return User.find();
  }

  @Query(() => User)
  @UseMiddleware(isAuth)
  me(@Ctx() { payload }: MyContext) {
    return User.createQueryBuilder("user")
      .select()
      .where("user.id = :id", { id: payload?.userId })
      .getOne();
  }

  @FieldResolver()
  async subjects(@Root() root: User) {
    return Subject.createQueryBuilder("subject")
      .where("subject.userId = :id", { id: root.id })
      .getMany();
  }

  @FieldResolver()
  async tasks(@Root() root: User) {
    return Task.createQueryBuilder("task")
      .select()
      .where("task.userId = :id", { id: root.id })
      .getMany();
  }
  // Login mutation
  @Mutation(() => LoginUnion)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<typeof LoginUnion> {
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
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return { errors: [{ field: "password", message: "Incorrect password" }] };
    }
    // Send refresh token cookie
    sendRefreshToken(res, createRefreshToken(user));

    return {
      user: user,
      accesToken: createAccesToken(user),
    };
  }

  // Register mutation
  @Mutation(() => RegisterUnion)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("name") name: string,
    @Ctx() { res }: MyContext
  ): Promise<typeof RegisterUnion> {
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

  @Query(() => Boolean)
  async userExists(@Arg("email") email: string) {
    const user = await User.findOne({ where: { email } });
    if (user) {
      return true;
    } else {
      return false;
    }
  }
}
