import { UserSchema } from "src/db/schema";
import {
  NewUserTrainingDaySchema,
  UserTrainingDaySchema,
  userTrainingDays,
} from "src/db/schema/training_days";
import User from "src/models/user/user";
import {
  DbModelResponse,
  dbModelResponse,
  errorResponse,
} from "src/models/utils/model_responses";
import { DateErrors, isDateString } from "src/utils/date_helpers";

export type UserTrainingDayUpsertResult = {
  error: string | null;
  userTrainingDaySchema: UserTrainingDaySchema | null;
};

export type UserTrainingDayRelations = {
  user: User | UserSchema;
};

export type UserTrainingDayWithRelations = Omit<
  UserTrainingDaySchema,
  "userId"
> &
  UserTrainingDayRelations;

export type NewUserTrainingDayWithRelations = Omit<
  NewUserTrainingDaySchema,
  "userId" | "createdAt" | "updatedAt" | "trashedAt" | "trashedBy"
> &
  UserTrainingDayRelations;

export default class UserTrainingDay implements UserTrainingDaySchema {
  protected _id: number;
  protected _userId: number;
  protected _date: string;
  protected _trashedAt: Date | null;
  protected _trashedBy: number | null;
  protected _updatedAt: Date;
  protected _createdAt: Date;
  protected _user: User;

  constructor(attributes: UserTrainingDayWithRelations) {
    this._id = attributes.id;
    this._date = attributes.date;
    this._trashedAt = attributes.trashedAt;
    this._trashedBy = attributes.trashedBy;
    this._updatedAt = attributes.updatedAt;
    this._createdAt = attributes.createdAt;
    if (attributes.user instanceof User) {
      this._user = attributes.user;
    } else {
      this._user = new User(attributes.user);
    }
    this._userId = this._user.id;
  }

  static async create(
    attributes: NewUserTrainingDayWithRelations
  ): Promise<DbModelResponse<UserTrainingDay>> {
    if (attributes.date && !isDateString(attributes.date)) {
      return dbModelResponse({
        errorMessage: DateErrors.INVALID_DATE_STRING,
      });
    }

    const { user, ...newTrainingDayAttributes } = attributes;

    const now = new Date(Date.now());

    const updatedAttr = {
      ...newTrainingDayAttributes,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.transaction(async (tx) => {
      let userTrainingDaySchema: UserTrainingDaySchema;
      try {
        [userTrainingDaySchema] = await tx
          .insert(userTrainingDays)
          .values(updatedAttr)
          .returning();
      } catch (err) {
        return UserTrainingDay._userTrainingDayCreateResult({
          error: errorResponse(err, "UserTrainingDay.create"),
        });
      }
      return UserTrainingDay._userTrainingDayCreateResult({
        userTrainingDaySchema,
      });
    });

    if (result.error) {
      return dbModelResponse({ errorMessage: result.error });
    }

    const userTrainingDay = new UserTrainingDay({
      ...result.userTrainingDaySchema!,
      user,
    });

    return dbModelResponse({ value: userTrainingDay });
  }

  static _userTrainingDayCreateResult(
    result: Partial<UserTrainingDayUpsertResult>
  ): UserTrainingDayUpsertResult {
    return {
      error: result.error || null,
      userTrainingDaySchema: result.userTrainingDaySchema || null,
    };
  }

  // Getters
  get id(): number {
    return this._id;
  }

  get userId(): number {
    return this._userId;
  }

  get date(): string {
    return this._date;
  }

  get trashedAt(): Date | null {
    return this._trashedAt;
  }

  get trashedBy(): number | null {
    return this._trashedBy;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get user(): User | null {
    return this._user;
  }

  // Setters
  set id(id: number) {
    this._id = id;
  }

  set userId(userId: number) {
    this._userId = userId;
  }

  set date(date: string) {
    this._date = date;
  }

  set trashedAt(trashedAt: Date | null) {
    this._trashedAt = trashedAt;
  }

  set trashedBy(trashedBy: number | null) {
    this._trashedBy = trashedBy;
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt;
  }

  set createdAt(createdAt: Date) {
    this._createdAt = createdAt;
  }

  set user(user: User) {
    this._user = user;
  }
}
