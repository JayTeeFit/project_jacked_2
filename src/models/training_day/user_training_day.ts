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
import { DateErrors, isDateString, toDateString } from "src/utils/date_helpers";

export type UserTrainingDayUpsertResult = {
  error: string | null;
  userTrainingDaySchema: UserTrainingDaySchema | null;
};

export type UserTrainingDayRelations = {
  user: User | number;
};

export type UserTrainingDayWithRelations = Omit<
  UserTrainingDayInterface,
  "userId"
> &
  UserTrainingDayRelations;

export type NewUserTrainingDayWithRelations = Omit<
  NewUserTrainingDayInterface,
  "userId" | "createdAt" | "updatedAt" | "trashedAt" | "trashedBy"
> &
  UserTrainingDayRelations;

export type UserTrainingDayInterface = Omit<UserTrainingDaySchema, "date"> & {
  date: Date;
};

export type NewUserTrainingDayInterface = Omit<
  NewUserTrainingDaySchema,
  "date"
> & { date: Date };

export default class UserTrainingDay implements UserTrainingDayInterface {
  protected _id: number;
  protected _userId: number;
  protected _date: Date;
  protected _trashedAt: Date | null;
  protected _trashedBy: number | null;
  protected _updatedAt: Date;
  protected _createdAt: Date;
  protected _user: User | null;

  constructor(attributes: UserTrainingDayWithRelations) {
    this._id = attributes.id;
    this._date = attributes.date;
    this._trashedAt = attributes.trashedAt;
    this._trashedBy = attributes.trashedBy;
    this._updatedAt = attributes.updatedAt;
    this._createdAt = attributes.createdAt;
    if (attributes.user instanceof User) {
      this._user = attributes.user;
      this._userId = attributes.user.id;
    } else {
      this._userId = attributes.user;
      this._user = null;
    }
  }

  static async create(
    attributes: NewUserTrainingDayWithRelations
  ): Promise<DbModelResponse<UserTrainingDay>> {
    const dateString = toDateString(attributes.date);

    if (dateString === DateErrors.INVALID_DATE) {
      return dbModelResponse({
        errorMessage: DateErrors.INVALID_DATE,
      });
    }

    const { user, ...rest } = attributes;

    const now = new Date(Date.now());

    const updatedAttr = {
      ...rest,
      userId: user instanceof User ? user.id : user,
      date: dateString,
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
      date: new Date(result.userTrainingDaySchema!.date),
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

  async getUser() {
    if (this._user) {
      return this._user;
    }

    this.user = await User.findUserById(this._userId);
    return this.user;
  }

  // Getters
  get id(): number {
    return this._id;
  }

  get userId(): number {
    return this._userId;
  }

  get date(): Date {
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

  set date(date: Date) {
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

  set user(user: User | null) {
    this._user = user;
  }
}
