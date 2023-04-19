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
import { Settings } from "../entities/Settings";
import dayjs from "dayjs";
import { queueMiddleware } from "../middleware/queueMiddleware";

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

@ObjectType()
class ChangePasswordSucces {
  @Field()
  changePassword: Boolean;
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

const ChangePasswordUnion = createUnionType({
  name: "ChangePasswordResponse",
  types: () => [ChangePasswordSucces, UserFail] as const,
  resolveType: (value) => {
    if ("errors" in value) {
      return UserFail;
    } else {
      return ChangePasswordSucces;
    }
  },
});

const isEmailValid = (_email: string) => {
  return true;
};

@Resolver(User)
export class userResolver {
  @FieldResolver()
  async usesOAuth(@Root() root: User) {
    return Boolean(root.googleId);
  }

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
    return User.findOne({
      where: { id: payload?.userId },
      relations: { settings: true },
    });
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
    if (!isEmailValid(email)) {
      return {
        errors: [
          {
            field: "email",
            message: "Enter a valid email",
          },
        ],
      };
    }
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

    const settings = await Settings.create({
      startOfRotationDate: dayjs().set("day", 1).toDate(),
    }).save();
    try {
      user = await User.create({
        email,
        password: hashedPassword,
        fullName: name,
        settings,
      }).save();
      console.log(settings);
    } catch (err) {
      await settings.remove();
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
      const settings = await Settings.create({
        startOfRotationDate: dayjs().set("day", 1).toDate(),
      }).save();
      user = await User.create({
        email: response.email,
        fullName: response.name,
        googleId: response.userId,
        imageURL: response.pictureURL,
        settings,
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

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async editUser(
    @Ctx() { payload }: MyContext,
    @Arg("fullName", { nullable: true }) fullName?: string,
    @Arg("email", { nullable: true }) email?: string
  ) {
    await User.update({ id: payload?.userId }, { fullName, email });
    return User.findOne({
      where: { id: payload?.userId },
      relations: { settings: true },
    });
  }

  @Mutation(() => ChangePasswordUnion)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async changePassword(
    @Arg("oldPassword") oldPassword: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { payload }: MyContext
  ): Promise<ChangePasswordSucces | UserFail> {
    const user = await User.findOne({ where: { id: payload?.userId } });
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    const valid = await argon2.verify(user.password, oldPassword);
    if (!valid) {
      return { errors: [{ field: "password", message: "Incorrect password" }] };
    }
    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;
    user.save();
    return {
      changePassword: true,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");
    return true;
  }
}
