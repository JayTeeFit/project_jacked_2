import UserTrainingDay from "src/models/training_day/user_training_day";
import { createDefaultUser } from "src/models/utils/user_test_helpers";
import { dbTestSuite } from "src/test_helpers/setup_server_test_suite";
import { createUserTrainingDay } from "src/test_helpers/training_day_test_helpers";
import { toDateString } from "src/utils/date_helpers";

dbTestSuite("UserTrainingDay", () => {
  suite("Create", () => {
    test("can create a user training day", async () => {
      const user = await createDefaultUser();

      const trainingDay = await createUserTrainingDay({
        user,
        date: new Date(Date.now()),
      });

      expect(trainingDay.userId).toBe(user.id);
      expect(trainingDay.user).toBe(user);
    });

    test("can create multiple training days for a user", async () => {
      const user = await createDefaultUser();

      const today = new Date(Date.now());

      const trainingDay = await createUserTrainingDay({ user, date: today });

      expect(toDateString(trainingDay.date)).toBe(toDateString(today));

      const tomorrow = today;
      tomorrow.setDate(tomorrow.getDate() + 1);

      const trainingDay2 = await createUserTrainingDay({
        user,
        date: tomorrow,
      });

      expect(toDateString(trainingDay2.date)).toBe(toDateString(tomorrow));
    });

    test("can create a training day with user id", async () => {
      const user = await createDefaultUser();

      const today = new Date(Date.now());

      const trainingDay = await createUserTrainingDay({
        user: user.id,
        date: today,
      });
    });

    test("rejects invalid date", async () => {
      const user = await createDefaultUser();

      let date = new Date("abc");
      let response = await UserTrainingDay.create({
        user,
        date,
      });

      expect(response.errorMessage).not.toBeNull();
    });
  });

  suite("getUser", () => {
    test("fetches user", async () => {
      const user = await createDefaultUser();

      const trainingDay = await createUserTrainingDay({
        user: user.id,
        date: new Date(Date.now()),
      });

      const fetchedUser = await trainingDay.getUser();

      expect(fetchedUser).not.toBeNull();
      expect(fetchedUser!.id).toEqual(user.id);
      expect(fetchedUser).toEqual(trainingDay.user);
    });
  });
});
