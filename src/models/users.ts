import { UserSchema, NewUserSchema, users } from "src/db/schema";

export class User {
  protected _id: number;

  constructor(attributes: UserSchema) {
    this._id = attributes.id;
  }

  static async create(attributes: NewUserSchema) {
    const result = db.transaction(async (tx) => {
      await tx.insert(users).values(attributes);
    });
  }
}
