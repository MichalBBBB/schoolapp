import { User } from "../entities/User";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
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
import {
  EMAIL_VERIFICATION_PREFIX,
  sendVerificationEmail,
} from "../utils/email/verifyEmail";
import {
  RESET_PASSWORD_PREFIX,
  sendResetPasswordEmail,
} from "../utils/email/resetPassword";
import {
  LoginUnion,
  RegisterUnion,
  UserSuccess,
  ChangePasswordUnion,
  ChangePasswordSuccess,
  UserFail,
  ForgotPasswordUnion,
  ForgotPasswordSuccess,
} from "../types/userResponseTypes";
import { Schedule } from "../entities/Schedule";
import appleSignin from "apple-signin-auth";
import crypto from "node:crypto";

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

  // !!!! Remove !!!!
  @Mutation(() => Boolean)
  async verifyUsersEmail(@Arg("email") email: string) {
    const user = await User.findOne({ where: { email } });
    if (user) {
      user.emailVerified = true;
      await user.save();
    } else {
      throw new Error("user wasn't found");
    }
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
    if (user.password) {
      const valid = await argon2.verify(user.password, password);
      if (!valid) {
        return {
          errors: [{ field: "password", message: "Incorrect password" }],
        };
      }
    } else {
      return {
        errors: [{ field: "password", message: "Incorrect password" }],
      };
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
    @Ctx() { res, redis }: MyContext
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
      await Schedule.create({
        name: "Default Schedule",
        default: true,
        userId: user.id,
      }).save();
      // Send refresh token cookie
      sendVerificationEmail({ email: user.email, userId: user.id, redis });
      sendRefreshToken(res, createRefreshToken(user));
      return {
        user,
        accessToken: createAccesToken(user),
      };
    } else {
      throw new Error("an error occured");
    }
  }

  @Mutation(() => Boolean)
  async verifyEmail(@Arg("token") token: string, @Ctx() { redis }: MyContext) {
    const key = EMAIL_VERIFICATION_PREFIX + token;
    const userId = await redis.get(key);
    if (userId) {
      console.log("verify email successful");
      await User.update({ id: userId }, { emailVerified: true });
      redis.del(key);
      return true;
    } else {
      throw new Error("An error occured");
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async resendVerificationEmail(@Ctx() { payload, redis }: MyContext) {
    const user = await User.findOne({ where: { id: payload?.userId } });
    if (user) {
      sendVerificationEmail({ email: user.email, userId: user.id, redis });
      return true;
    } else {
      throw new Error("This account doesn't exist");
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addNotificationToken(
    @Arg("token") token: string,
    @Ctx() { payload }: MyContext
  ) {
    const user = await User.findOne({ where: { id: payload?.userId } });

    if (user) {
      console.log("tokens", user.tokens);
      // user.tokens = [];
      // await user.save();
      if (user.tokens.includes(token)) {
        return true;
      } else {
        user.tokens = [...user.tokens, token];
        await user.save();
        return true;
      }
    } else {
      throw new Error("User not found");
    }
  }

  @Mutation(() => UserSuccess)
  async googleSignIn(
    @Arg("idToken") idToken: string,
    @Ctx() { res }: MyContext
  ): Promise<UserSuccess> {
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
        emailVerified: true,
        settings,
      }).save();
      await Schedule.create({
        name: "Default Schedule",
        default: true,
        userId: user.id,
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

  @Mutation(() => UserSuccess)
  async appleSignIn(
    @Arg("idToken") idToken: string,
    @Arg("nonce") nonce: string,
    @Arg("fullName") fullName: string,
    @Ctx() { res }: MyContext
  ) {
    const result = await appleSignin.verifyIdToken(idToken, {
      clientId: "app.dayto.dayto",
      nonce: crypto.createHash("sha256").update(nonce).digest("hex"),
    });
    let user;
    user = await User.findOne({ where: { appleIdToken: idToken } });
    if (!user) {
      const settings = await Settings.create({
        startOfRotationDate: dayjs().set("day", 1).toDate(),
      }).save();
      user = await User.create({
        email: result.email,
        fullName: fullName,
        appleIdToken: idToken,
        emailVerified: true,
        settings,
      }).save();
      await Schedule.create({
        name: "Default Schedule",
        default: true,
        userId: user.id,
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
    @Ctx() { payload, redis }: MyContext,
    @Arg("fullName", { nullable: true }) fullName?: string,
    @Arg("email", { nullable: true }) email?: string
  ) {
    const user = await User.findOne({ where: { id: payload?.userId } });
    if (user) {
      if (email && user?.email !== email) {
        sendVerificationEmail({ email: email, userId: user.id, redis });
      }
      await User.update(
        { id: payload?.userId },
        { fullName, email, emailVerified: false }
      );
      return User.findOne({
        where: { id: payload?.userId },
        relations: { settings: true },
      });
    } else {
      throw new Error("User doesn't exist");
    }
  }

  @Mutation(() => ChangePasswordUnion)
  @UseMiddleware(isAuth)
  @UseMiddleware(queueMiddleware)
  async changePassword(
    @Arg("oldPassword") oldPassword: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { payload }: MyContext
  ): Promise<ChangePasswordSuccess | UserFail> {
    const user = await User.findOne({ where: { id: payload?.userId } });
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    const valid = await argon2.verify(user.password || "", oldPassword);
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

  @Mutation(() => ForgotPasswordUnion)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ): Promise<ForgotPasswordSuccess | UserFail> {
    const user = await User.findOne({ where: { email } });
    if (user) {
      sendResetPasswordEmail({
        email,
        userId: user?.id,
        redis,
        name: user.fullName,
      });
      return {
        forgotPassword: true,
      };
    } else {
      return {
        errors: [
          {
            field: "email",
            message: "An account with this email doesn't exist",
          },
        ],
      };
    }
  }

  @Mutation(() => ChangePasswordUnion)
  async resetPassword(
    @Arg("newPassword") newPassword: string,
    @Arg("token") token: string,
    @Ctx() { redis }: MyContext
  ): Promise<ChangePasswordSuccess | UserFail> {
    console.log("here");
    const key = RESET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    console.log(userId, newPassword);
    if (userId) {
      const hashedPassword = await argon2.hash(newPassword);
      await User.update({ id: userId }, { password: hashedPassword });
      redis.del(key);
      return {
        changePassword: true,
      };
    } else {
      throw new Error("An error occured");
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteAccount(@Ctx() { payload }: MyContext) {
    const user = await User.findOne({ where: { id: payload?.userId } });
    if (user) {
      await user.remove();

      return true;
    } else {
      throw new Error("User doesn't exist");
    }
  }

  @Mutation(() => Boolean)
  async logout(
    @Ctx() { payload, res }: MyContext,
    @Arg("notificationToken", { nullable: true }) token: string
  ) {
    const user = await User.findOne({ where: { id: payload?.userId } });
    if (user) {
      user.tokens = user.tokens.filter((item) => item !== token);
      await user.save();
    }
    sendRefreshToken(res, "");
    return true;
  }
}
