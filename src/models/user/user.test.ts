import { NewUserSchema, UserSchema, users } from "src/db/schema/users/users";
import User from "src/models/user/user";
import UserProfile from "src/models/user/user_profile";
import { dbTestSuite } from "src/test_helpers/setup_server_test_suite";
import Sinon from "sinon";
import { eq } from "drizzle-orm";
import { ResponseStatus } from "src/models/utils/model_responses";
import { userProfiles } from "src/db/schema";
import {
  createDefaultUser,
  defaultTestUserSchema,
} from "src/models/utils/user_test_helpers";

dbTestSuite("UserModel", () => {
  // const defaultTestUserSchema = {
  //   username: "rengebre",
  //   email: "russell@email.com",
  //   isClaimed: true,
  //   isAdmin: true,
  // };
  // const defaultTestUserProfileSchema = {
  //   firstName: "Russell",
  //   lastName: "Engebretson",
  //   aboutMe: "Founder of this beautiful application",
  // };

  // async function createDefaultUser(
  //   addUserProperties: Partial<NewUserSchema>,
  //   withProfile?: boolean
  // ) {
  //   const userSchema = {
  //     ...defaultTestUserSchema,
  //     ...addUserProperties,
  //   };
  //   const user = await User.create(userSchema, {
  //     profileInfo: withProfile ? defaultTestUserProfileSchema : undefined,
  //   });
  //   return user.value;
  // }

  suite("Create", () => {
    test("can create a user", async () => {
      const userOrNull = await createDefaultUser({}, false);

      expect(userOrNull).not.toBeNull();

      const user = userOrNull as User;

      expect(user.email).toBe(defaultTestUserSchema.email);
      expect(user.username).toBe(defaultTestUserSchema.username);
    });

    test("can create a user with a profile", async () => {
      const userOrNull = await createDefaultUser({}, true);

      expect(userOrNull).not.toBeNull();

      const user = userOrNull as User;

      expect(user.profile).not.toBeNull();
      expect(user.profile).toBeInstanceOf(UserProfile);
    });

    test("enforces unique emails", async () => {
      await createDefaultUser({}, false);
      const newUser: NewUserSchema = {
        username: "test",
        email: defaultTestUserSchema.email,
      };

      const userResponse = await User.create(newUser);
      expect(userResponse.value).toBeNull();
      expect(userResponse.errorMessage).not.toBeNull();
    });

    test("enforces lowercase emails", async () => {
      const email = defaultTestUserSchema.email.toUpperCase();
      const newUser: NewUserSchema = {
        username: "test",
        email,
      };

      const userResponse = await User.create(newUser);
      const userOrNull = userResponse.value;

      expect(userOrNull).not.toBeNull();
      expect(userOrNull!.email).toBe(email.toLowerCase());
    });

    test("enforces case insensitive unique usernames", async () => {
      await createDefaultUser({}, false);
      const newUser: NewUserSchema = {
        username: defaultTestUserSchema.username.toUpperCase(),
        email: "1" + defaultTestUserSchema.email,
      };

      const userResponse = await User.create(newUser);
      expect(userResponse.value).toBeNull();
    });
  });

  suite("findUserById", () => {
    test("fetches a user with no relations", async () => {
      const user = await createDefaultUser({}, false);

      const foundUser = await User.findUserById(user!.id);
      expect(foundUser).not.toBeNull();
      expect(foundUser!.profile).toBeNull();
    });

    test("fetches and sets profile on user", async () => {
      const user = await createDefaultUser({}, true);

      const foundUser = await User.findUserById(user!.id, { profile: true });
      expect(foundUser).not.toBeNull();
      expect(foundUser!.profile).not.toBeNull();
    });
  });

  suite("profileAsync", () => {
    test("returns profile synchronously if pre-fetched", async () => {
      const dbSelectSpy = Sinon.spy(db, "select");
      const user = await createDefaultUser({}, true);
      expect(user).not.toBeNull();

      const profile = await user?.profileAsync();
      Sinon.assert.notCalled(dbSelectSpy);
    });

    test("fetches profile async", async () => {
      const createdUser = await createDefaultUser({}, true);
      expect(createdUser).not.toBeNull();

      const user = await User.findUserById(createdUser!.id);

      expect(user).not.toBeNull();
      expect(user!.profile).toBeNull();

      const asyncProfile = await user!.profileAsync();
      expect(asyncProfile).not.toBeNull();
      expect(asyncProfile).toEqual(user!.profile);
    });
  });

  suite("UpdateUser", () => {
    test("can update a user", async () => {
      const user = await createDefaultUser({}, false);
      expect(user).not.toBeNull();

      const newUsername = "newUsername";
      const updateAttr: Partial<UserSchema> = {
        username: newUsername,
      };

      await user!.updateUser(updateAttr);
      const queriedUser = await User.findUserById(user!.id);

      expect(user!.username).toBe(newUsername);
      expect(queriedUser!.username).toBe(newUsername);
    });

    test("updates updatedAt field", async () => {
      const newTime = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

      const user = await createDefaultUser({ updatedAt: newTime }, false);
      expect(user).not.toBeNull();

      const newUsername = "newUsername";
      const updateAttr: Partial<UserSchema> = {
        username: newUsername,
      };

      await user!.updateUser(updateAttr);

      expect(user?.updatedAt.getTime()).toBeGreaterThan(newTime.getTime());
    });

    suite("trash", () => {
      test("trashes a user", async () => {
        const user = await createDefaultUser({}, false);
        expect(user).not.toBeNull();

        await user!.trash(user!.id);
        expect(user!.trashedBy).toBe(user!.id);
        expect(user!.trashedAt).not.toBeNull();
        expect(user!.isActive).toBe(false);
      });
    });

    suite("remove", () => {
      test("deletes a user from db", async () => {
        const user = await createDefaultUser({}, false);
        expect(user).not.toBeNull();

        const userId = user!.id;
        const response = await user!.remove();
        expect(response.status).toBe(ResponseStatus.SUCCESS);

        const userFound = await User.findUserById(userId);
        expect(userFound).toBeNull();
      });

      test("deletes users profile", async () => {
        const user = await createDefaultUser({}, false);
        expect(user).not.toBeNull();

        const userId = user!.id;
        const response = await user!.remove();
        expect(response.status).toBe(ResponseStatus.SUCCESS);

        const [userProfile] = await db
          .select()
          .from(userProfiles)
          .where(eq(userProfiles.userId, userId));
        expect(userProfile).toBeUndefined();
      });
    });
  });
});
