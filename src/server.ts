import "src/config/index";
import "src/utils/globals";
import "src/types/process_env";
import express, { Express, Request, Response } from "express";
import { users } from "src/db/schema/users";
import { db } from "src/db";
import { eq } from "drizzle-orm";

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  const user = await db.query.users.findFirst({
    with: {
      profile: true,
    },
    where: eq(users.id, 2),
  });
  // const user = result.at(0);
  res.send(
    `<h1>Hello ${user?.username}</h1>` +
      `<div>Your account email is: ${user?.email}</div>` +
      `<div>your user profile is: ${JSON.stringify(user?.profile)}</div>`
  );
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
