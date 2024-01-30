import { NewUserSchema } from "src/db/schema/users";
import User from "src/models/user/user";

export const defaultTestUserSchema = {
  username: "rengebre",
  email: "russell@email.com",
  isClaimed: true,
  isAdmin: true,
};
export const defaultTestUserProfileSchema = {
  firstName: "Russell",
  lastName: "Engebretson",
  aboutMe: "Founder of this beautiful application",
};

export async function createDefaultUser(
  addUserConfig: Partial<NewUserSchema>,
  withProfile?: boolean
) {
  const userSchema = {
    ...defaultTestUserSchema,
    ...addUserConfig,
  };
  const user = await User.create(userSchema, {
    profileInfo: withProfile ? defaultTestUserProfileSchema : undefined,
  });
  return user.value;
}
