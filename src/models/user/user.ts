import { UserSchema, NewUserSchema, users } from "src/db/schema/users/users";
import {
  NewUserProfileSchema,
  UserProfileSchema,
  userProfiles,
} from "src/db/schema/users/user_profiles";
import { Premiumness } from "src/db/schema/types/user";
import UserProfile from "src/models/user/user_profile";
import { eq } from "drizzle-orm";
import {
  DbUpsertModelResponse,
  dbModelResponse,
} from "src/models/utils/model_responses";

export type OptionalUserRelations = {
  profileInfo?: Omit<NewUserProfileSchema, "userId">;
};

export type UserCreateResult = {
  error: string | null;
  userSchema: UserSchema | null;
  userProfileSchema: UserProfileSchema | null;
};

export type UserUpdateResult = {
  error: string | null;
  userSchema: UserSchema | null;
};

export type UserRelations = {
  profile?: UserProfile | null;
};

export type UserSchemaWithRelations = UserSchema & UserRelations;

export default class User {
  protected _id: number;
  protected _username: string;
  protected _email: string;
  protected _isActive: boolean;
  protected _isClaimed: boolean;
  protected _isAdmin: boolean;
  protected _premiumness: Premiumness;
  protected _trashedAt: Date | null;
  protected _trashedBy: number | null;
  protected _updatedAt: Date;
  protected _createdAt: Date;
  protected _profile: UserProfile | null;

  constructor(attributes: UserSchemaWithRelations) {
    this._id = attributes.id;
    this._username = attributes.username;
    this._email = attributes.email;
    this._isActive = attributes.isActive;
    this._isClaimed = attributes.isClaimed;
    this._isAdmin = attributes.isAdmin;
    this._premiumness = attributes.premiumness;
    this._trashedAt = attributes.trashedAt;
    this._trashedBy = attributes.trashedBy;
    this._updatedAt = attributes.updatedAt;
    this._createdAt = attributes.createdAt;
    this._profile = attributes.profile || null;
  }

  /**
   * Creates a User and persists to the db asynchronously
   *
   * @remarks As a biproduct, a user profile is also created and associated with the created user
   * @param attributes - the attributes to describe the user
   * @param optRelationConfigs  - optional attribute details for objects which are created in association with the user (e.g. user profile)
   * @returns a User object if successfully committed to db, or null if there is a problem in the transaction
   */
  static async create(
    attributes: NewUserSchema,
    optRelationConfigs?: OptionalUserRelations
  ): Promise<DbUpsertModelResponse<User>> {
    const result: UserCreateResult = await db.transaction(async (tx) => {
      let userSchema: UserSchema;
      let userProfileSchema: UserProfileSchema;
      // enforce lower case email
      const updatedAttr = { ...attributes };
      updatedAttr.email = attributes.email.toLowerCase();

      try {
        [userSchema] = await tx.insert(users).values(updatedAttr).returning();
        const newUserProfileSchema: NewUserProfileSchema = {
          userId: userSchema.id,
          ...optRelationConfigs?.profileInfo,
        };

        [userProfileSchema] = await tx
          .insert(userProfiles)
          .values(newUserProfileSchema)
          .returning();
      } catch (err) {
        return User._userCreateResult({
          error: getErrorMessage(err) || "unkown error",
        });
      }
      return User._userCreateResult({ userSchema, userProfileSchema });
    });

    if (result.error) {
      return dbModelResponse({ errorMessage: result.error });
    }

    const profile = new UserProfile(
      result.userProfileSchema as UserProfileSchema
    );

    const user = new User({ ...(result.userSchema as UserSchema), profile });

    return dbModelResponse({ value: user });
  }

  static async findUserById(id: number): Promise<User | null> {
    const result = await db.query.users.findFirst({ where: eq(users.id, id) });

    if (!result) {
      return null;
    }

    const userSchema: UserSchemaWithRelations = {
      ...result,
    };

    return new User(userSchema);
  }

  static _userCreateResult(
    result: Partial<UserCreateResult>
  ): UserCreateResult {
    return {
      error: result.error || null,
      userSchema: result.userSchema || null,
      userProfileSchema: result.userProfileSchema || null,
    };
  }

  async profileAsync() {
    if (this.profile) {
      return this.profile;
    }

    const [profileSchema] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, this.id));

    const profile = new UserProfile(profileSchema);
    this.profile = profile;

    return profile;
  }

  async updateUser(
    attributes: Partial<Omit<UserSchema, "id">>
  ): Promise<DbUpsertModelResponse<User>> {
    const updateAttr = { ...attributes };
    updateAttr.updatedAt = new Date(Date.now());

    if (attributes.email) {
      updateAttr.email = attributes.email;
    }

    let userSchema: UserSchema;

    const result = await db.transaction(async (tx) => {
      try {
        [userSchema] = await tx
          .update(users)
          .set(updateAttr)
          .where(eq(users.id, this.id))
          .returning();
      } catch (err) {
        return this._userUpdateResult({
          error: getErrorMessage(err) || "unkown error",
        });
      }
      return this._userUpdateResult({ userSchema });
    });

    if (result.error) {
      return dbModelResponse({ errorMessage: result.error });
    }

    this._updateUserProperties(result.userSchema as UserSchema);

    return dbModelResponse({ value: this });
  }

  _userUpdateResult(result: Partial<UserCreateResult>): UserUpdateResult {
    return {
      error: result.error || null,
      userSchema: result.userSchema || null,
    };
  }

  _updateUserProperties(properties: UserSchema) {
    Object.entries(properties).forEach(([property, value]) => {
      // @ts-ignore
      this[property] = value;
    });
  }

  // Getters
  public get id() {
    return this._id;
  }

  public get username() {
    return this._username;
  }

  public get email() {
    return this._email;
  }

  public get isActive() {
    return this._isActive;
  }

  public get isClaimed() {
    return this._isClaimed;
  }

  public get isAdmin() {
    return this._isAdmin;
  }

  public get premiumness() {
    return this._premiumness;
  }

  public get trashedAt() {
    return this._trashedAt;
  }

  public get trashedBy() {
    return this._trashedBy;
  }

  public get updatedAt() {
    return this._updatedAt;
  }

  public get createdAt() {
    return this._createdAt;
  }

  /**
   * Returns the user profile for this user if it has been pre-fetched, null otherwise
   * @remarks
   * You should use profileAsync() unless you know it will exist, since it calls this before querying the db
   */
  public get profile() {
    return this._profile;
  }

  // Setters
  public set profile(profile: UserProfile | null) {
    this._profile = profile;
  }

  public set id(id: number) {
    this._id = id;
  }

  public set username(username: string) {
    this._username = username;
  }

  public set email(email: string) {
    this._email = email;
  }

  public set isActive(isActive: boolean) {
    this._isActive = isActive;
  }

  public set isClaimed(isClaimed: boolean) {
    this._isClaimed = isClaimed;
  }

  public set isAdmin(isAdmin: boolean) {
    this._isAdmin = isAdmin;
  }

  public set premiumness(premiumness: Premiumness) {
    this._premiumness = premiumness;
  }

  public set trashedAt(time: Date | null) {
    this._trashedAt = time;
  }

  public set trashedBy(time: number | null) {
    this._trashedBy = time;
  }

  public set updatedAt(time: Date) {
    this._updatedAt = time;
  }

  public set createdAt(time: Date) {
    this._createdAt = time;
  }
}
