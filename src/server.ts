import "src/config/index";
import "src/utils/error_handling_helpers";
import "src/types/process_env";
import "src/db";
import express, { Express, Request, Response } from "express";
import { users, NewUserSchema } from "src/db/schema/users/users";
import {
  userProfiles,
  NewUserProfileSchema,
} from "src/db/schema/users/user_profiles";
import { eq } from "drizzle-orm";

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  const user = await db.query.users.findFirst({
    with: {
      profile: true,
    },
    where: eq(users.username, "rengebre"),
  });
  res.send(
    `<h1>Hello ${user?.username}</h1>` +
      `<div>Your account email is: ${user?.email}</div>` +
      `<div>your user profile is: ${JSON.stringify(user?.profile)}</div>`
  );
});

app.get("/insertuser", async (req: Request, res: Response) => {
  const newAdmin: NewUserSchema = {
    username: "rengebre",
    email: "russell.engebretson@gmail.com",
    isAdmin: true,
    isClaimed: true,
  };

  const newUser: NewUserSchema = {
    username: "test",
    email: "test@email.com",
    premiumness: "coach",
  };
  await db.insert(users).values(newUser);

  const result = await db
    .insert(users)
    .values(newAdmin)
    .onConflictDoNothing()
    .returning();

  res.send(JSON.stringify(result));
});

app.get("/insertprofile/:user_id", async (req, res) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(req.params.user_id, 10)));
  const user = result.at(0);

  if (user) {
    const newProfile: NewUserProfileSchema = {
      userId: user.id,
      firstName: "Russell",
      lastName: "Engberetson",
      aboutMe: "Greatest jacked n tanned creator ever",
    };
    const profile = await db
      .insert(userProfiles)
      .values(newProfile)
      .onConflictDoNothing()
      .returning();
    return res.send(
      `<div>user: ${JSON.stringify(user)}</div>` +
        `<div>profile: ${JSON.stringify(profile)}</div>`
    );
  }
  res.send("Something failed");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
