import cls from "cls-hooked";
import { DbConfigs } from "src/config/database";
import { Sequelize } from "sequelize-typescript";
import Models from "src/models";

export default class Database {
  isTestEnv: boolean;
  env: NodeEnv;
  dbConfigs: DbConfigs;
  connection?: Sequelize;

  constructor(nodeEnv: NodeEnv, dbConfigs: DbConfigs) {
    this.env = nodeEnv;
    this.dbConfigs = dbConfigs;
    this.isTestEnv = this.env === "test";
  }

  async connect() {
    // set up namespace for transactions
    const namespace = cls.createNamespace("transactions-namespace");
    Sequelize.useCLS(namespace);

    // create connection
    const { username, password, host, port, database, dialect } =
      this.dbConfigs[this.env];
    this.connection = new Sequelize({
      username,
      password,
      host,
      port,
      database,
      dialect,
      logging: this.isTestEnv ? false : console.log,
    });

    // check if we connected successfully
    await this.connection.authenticate({
      logging: false,
    });

    if (!this.isTestEnv) {
      console.log("Connection to db has been established successfully");
    }

    // Register the models
    const models = new Models();
    models.registerModels(this.connection);

    //Sync the models
    await this.sync();
  }

  async disconnect() {
    if (!this.connection) {
      throw new Error(
        "Attempting to disconnect from a unestablished db connection"
      );
    }
    await this.connection.close();
  }

  async sync() {
    if (!this.connection) {
      throw new Error("Attempting to sync to an unestablished db connection");
    }
    await this.connection.sync({
      logging: false,
      force: this.isTestEnv,
    });

    if (!this.isTestEnv) {
      console.log("Connection synced successfully");
    }
  }
}
