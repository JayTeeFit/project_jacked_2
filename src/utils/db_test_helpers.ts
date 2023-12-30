import "src/config";
import Database from "src/db";
import dbConfigs from "src/config/database";

let db: Database;

export default class DbTestHelpers {
  static async startDb() {
    db = new Database("test", dbConfigs);
    await db.connect();
    return db;
  }

  static async stopDb() {
    await db.disconnect();
  }

  static async syncDb() {
    await db.sync();
  }
}
