import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize-typescript";

interface Model {
  name: string;
  associate?: (models: ModelsRecord) => void;
}

type ModelsRecord = Record<string, Model>;

class Models {
  sequelize?: Sequelize;
  models: ModelsRecord;
  constructor() {
    this.models = {};
  }

  registerModels(sequelize: Sequelize) {
    const thisFile = path.basename(__filename);
    const filteredModelFiles = fs.readdirSync(__dirname).filter((file) => {
      return file !== thisFile && file.slice(-3) === ".ts";
    });

    filteredModelFiles.forEach((mf) => {
      const model: Model = require(path.join(__dirname, mf)).default(sequelize);
      this.models[model.name] = model;
    });

    Object.keys(this.models).forEach((modelName) => {
      const model = this.models[modelName];
      if (model.associate) {
        model.associate(this.models);
      }
    });

    this.sequelize = sequelize;
  }
}

export default Models;
