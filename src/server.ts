import "src/config/index";
import Database from "src/db";
import env from "src/config/environment";
import dbConfigs from "src/config/database";
import "src/utils/globals";
import express, { Express, Request, Response } from "express";

(async () => {
  try {
    const db = new Database(env.nodeEnv, dbConfigs);
    await db.connect();
  } catch (error) {
    console.log(`Error connecting to db: ${getErrorMessage(error)}`);
  }
})();

// const app: Express = express();
// const port = process.env.PORT || 3000;

// app.get("/", (req: Request, res: Response) => {
//   res.send("My Server");
// });

// app.listen(port, () => {
//   console.log(`[server]: Server is running at http://localhost:${port}`);
// });
