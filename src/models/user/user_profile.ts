import {
  NewUserProfileSchema,
  UserProfileSchema,
  userProfiles,
} from "src/db/schema/users/user_profiles";
import {
  DbModelResponse,
  dbModelResponse,
} from "src/models/utils/model_responses";

export type UserProfileCreateResult = {
  error: string | null;
  userProfileSchema: UserProfileSchema | null;
};
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

  static async create(
    attributes: NewUserProfileSchema
  ): Promise<DbModelResponse<UserProfile>> {
    const result: UserProfileCreateResult = await db.transaction(async (tx) => {
      let newUserProfileSchema: NewUserProfileSchema = { ...attributes };
      let userProfileSchema: UserProfileSchema;
      try {
        [userProfileSchema] = await tx
          .insert(userProfiles)
          .values(newUserProfileSchema)
          .returning();
      } catch (err) {
        return UserProfile._userProfileCreateResult({
          error: getErrorMessage(err) || "unkown error",
        });
      }
      return UserProfile._userProfileCreateResult({ userProfileSchema });
    });

    if (result.error) {
      return dbModelResponse({ errorMessage: result.error });
    }

    const profile = new UserProfile(
      result.userProfileSchema as UserProfileSchema
    );
    return dbModelResponse({ value: profile });
  }

  static _userProfileCreateResult(
    result: Partial<UserProfileCreateResult>
  ): UserProfileCreateResult {
    return {
      error: result.error || null,
      userProfileSchema: result.userProfileSchema || null,
    };
  }

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
