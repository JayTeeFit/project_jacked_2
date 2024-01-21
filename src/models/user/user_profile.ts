import {
  NewUserProfileSchema,
  UserProfileSchema,
} from "src/db/schema/users/user_profiles";

export default class UserProfile {
  protected _id: number;
  protected _userId: number;
  protected _firstName: string | null;
  protected _lastName: string | null;
  protected _aboutMe: string | null;
  protected _updatedAt: Date | null;

  constructor(attributes: UserProfileSchema) {
    this._id = attributes.id;
    this._userId = attributes.userId;
    this._firstName = attributes.firstName;
    this._lastName = attributes.lastName;
    this._aboutMe = attributes.aboutMe;
    this._updatedAt = attributes.updatedAt;
  }

  // implement IF I need it
  static async create(attributes: NewUserProfileSchema) {}

  // Getters
  public get id() {
    return this._id;
  }

  public get userId() {
    return this._userId;
  }

  public get firstName() {
    return this._firstName;
  }

  public get lastName() {
    return this._lastName;
  }

  public get aboutMe() {
    return this._aboutMe;
  }

  public get updatedAt() {
    return this._updatedAt;
  }
}
