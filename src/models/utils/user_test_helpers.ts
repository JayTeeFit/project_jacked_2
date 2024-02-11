import { NewUserSchema } from "src/db/schema/users";
import User from "src/models/user/user";

export const defaultTestUserSchema: NewUserSchema = {
  email: "russell@email.com",
  username: "rengebre",
  isActive: true,
  isClaimed: true,
  isAdmin: true,
  premiumness: "coach",
};

export const defaultTestUserProfileSchema = {
  firstName: "Russell",
  lastName: "Engebretson",
  aboutMe: "Founder of this beautiful application",
};

export async function createDefaultUser(
  optUserConfig?: Partial<NewUserSchema>,
  withProfile = true
) {
  const userSchema = {
    ...defaultTestUserSchema,
    ...optUserConfig,
  };
  const user = await User.create(userSchema, {
    profileInfo: withProfile ? defaultTestUserProfileSchema : undefined,
  });

  expect(user.errorMessage).toBeNull();
  expect(user.value).not.toBeNull();

  return user.value!;
}
