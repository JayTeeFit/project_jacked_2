import { NewUserSchema, users } from "src/db/schema/users/users";
import User from "src/models/user/user";
import UserProfile from "src/models/user/user_profile";
import { dbTestSuite } from "src/test_helpers/setup_server_test_suite";
import Sinon from "sinon";
import { eq } from "drizzle-orm";

dbTestSuite("UserModel", () => {
  const defaultTestUserSchema = {
    username: "rengebre",
    email: "russell@email.com",
    isClaimed: true,
    isAdmin: true,
  };
  const defaultTestUserProfileSchema = {
    firstName: "Russell",
    lastName: "Engebretson",
    aboutMe: "Founder of this beautiful application",
  };

  async function createDefaultUser(withProfile?: boolean) {
    const user = await User.create(defaultTestUserSchema, {
      profileInfo: withProfile ? defaultTestUserProfileSchema : undefined,
    });
    return user.value;
  }
  suite("Create", () => {
    test("can create a user", async () => {
      const userOrNull = await createDefaultUser(false);

      expect(userOrNull).not.toBeNull();

      const user = userOrNull as User;

      expect(user.email).toBe(defaultTestUserSchema.email);
      expect(user.username).toBe(defaultTestUserSchema.username);
    });

    test("can create a user with a profile", async () => {
      const userOrNull = await createDefaultUser(true);

      expect(userOrNull).not.toBeNull();

      const user = userOrNull as User;

      expect(user.profile).not.toBeNull();
      expect(user.profile).toBeInstanceOf(UserProfile);
    });

    test("enforces unique emails", async () => {
      await createDefaultUser(false);
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
      await createDefaultUser(false);
      const newUser: NewUserSchema = {
        username: defaultTestUserSchema.username.toUpperCase(),
        email: "1" + defaultTestUserSchema.email,
      };

      const userResponse = await User.create(newUser);
      expect(userResponse.value).toBeNull();
    });
  });

  suite("fetchProfileAsync", () => {
    test("returns profile synchronously if pre-fetched", async () => {
      const dbSelectSpy = Sinon.spy(db, "select");
      const user = await createDefaultUser(true);
      expect(user).not.toBeNull();

      const profile = await user?.fetchProfileAsync();
      Sinon.assert.notCalled(dbSelectSpy);
    });

    test("fetches profile async", async () => {
      const createdUser = await createDefaultUser(true);
      expect(createdUser).not.toBeNull();

      const userSchema = await db.query.users.findFirst({
        where: eq(users.id, createdUser!.id),
      });

      const user = userSchema ? new User(userSchema) : null;
      expect(user).not.toBeNull();
      expect(user!.profile).toBeNull();

      const asyncProfile = await user!.fetchProfileAsync();
      expect(asyncProfile).not.toBeNull();
      expect(asyncProfile).toEqual(user!.profile);
    });
  });
});
