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
import { isAuth } from "../middleware/isAuth";
import { Task } from "../entities/Task";
import { Subject } from "../entities/Subject";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

const verify = async (
  idToken: string
): Promise<{
  name: string | undefined;
  userId: string | undefined;
  email: string | undefined;
  pictureURL: string | undefined;
}> => {
  const response = await client.verifyIdToken({
    idToken,
    audience:
      "1073547053227-8unebat1npl554u7sficsagpmpdkb08j.apps.googleusercontent.com",
  });
  const payload = response.getPayload();
  if (!payload) {
    throw new Error("an error occured");
  }
  const name = payload.name;
  const email = payload.email;
  const userId = payload.sub;
  const pictureURL = payload.picture;
  return {
    name,
    email,
    userId,
    pictureURL,
  };
};

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
  accessToken: string;
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

  @Mutation(() => Boolean)
  deleteAllGoogleUsers(@Arg("id") id: string) {
    User.delete({ id });
    return true;
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
      accessToken: createAccesToken(user),
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
      user = await User.create({
        email,
        password: hashedPassword,
        fullName: name,
      }).save();
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
    if (user) {
      // Send refresh token cookie
      sendRefreshToken(res, createRefreshToken(user));
      return {
        user,
        accessToken: createAccesToken(user),
      };
    } else {
      throw new Error("an error occured");
    }
  }

  @Mutation(() => UserSucces)
  async googleSignIn(
    @Arg("idToken") idToken: string,
    @Ctx() { res }: MyContext
  ): Promise<UserSucces> {
    const response = await verify(idToken);
    let user;
    user = await User.findOne({ where: { email: response.email } });
    if (!user) {
      user = await User.create({
        email: response.email,
        fullName: response.name,
        googleId: response.userId,
        imageURL: response.pictureURL,
      }).save();
    }
    if (user) {
      sendRefreshToken(res, createRefreshToken(user));
      return {
        user,
        accessToken: createAccesToken(user),
      };
    } else {
      throw new Error("an error occured");
    }
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
