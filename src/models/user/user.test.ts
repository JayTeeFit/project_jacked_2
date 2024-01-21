import { NewUserSchema } from "src/db/schema";
import User from "src/models/user/user";
import { dbTestSuite } from "src/test_helpers/setup_server_test_suite";

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

  it("can create a user", async () => {
    const userOrNull = await createDefaultUser(true);

    expect(userOrNull).not.toBeNull();

    const user = userOrNull as User;

    expect(user.email).toBe(defaultTestUserSchema.email);
    expect(user.username).toBe(defaultTestUserSchema.username);
  });

  it("enforces unique emails", async () => {
    await createDefaultUser(true);
    const newUser: NewUserSchema = {
      username: "test",
      email: defaultTestUserSchema.email,
    };

    const userResponse = await User.create(newUser);
    expect(userResponse.value).toBeNull();
    expect(userResponse.errorMessage).not.toBeNull();
  });

  it("enforces lowercase emails", async () => {
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

  // it("enforces unique usernames case insensitive", async () => {
  //   const newUser: NewUserSchema = {
  //     username: defaultTestUserSchema.username.toUpperCase(),
  //     email: "1" + defaultTestUserSchema.email,
  //   };

  //   const userOrNull = await User.create(newUser);
  //   expect(userOrNull).toBeNull();
  // });
});
