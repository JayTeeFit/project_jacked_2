import { UserSchema } from "src/db/schema/users";
import UserTrainingDay from "src/models/training_day/user_training_day";
import User from "src/models/user/user";
import { toDateString } from "src/utils/date_helpers";

export const createUserTrainingDay = async (attr: {
  user: User | number;
  date: Date;
}) => {
  const response = await UserTrainingDay.create({
    user: attr.user,
    date: toDateString(attr.date),
  });

  expect(response.errorMessage).toBeNull();
  expect(response.value).not.toBeNull();

  return response.value!;
};
