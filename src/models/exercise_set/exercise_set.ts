import { eq } from "drizzle-orm";
import { propertiesForSets, setProperties } from "src/db/schema";
import {
  ExerciseSetSchema,
  NewExerciseSetSchema,
  exerciseSets,
} from "src/db/schema/exercise_sets/exercise_sets";
import { PropertyForSetName } from "src/db/schema/types/sets";
import { ExertionUnit, WeightUnit } from "src/db/schema/types/units";
import SetProperty from "src/models/exercise_set/set_property";
import {
  DbModelResponse,
  RemoveResponse,
  ResponseStatus,
  dbModelResponse,
  errorResponse,
} from "src/models/utils/model_responses";

export type SetUpsertResult = {
  error: string | null;
  setSchema: ExerciseSetSchema | null;
};

export type PropertyMap = Partial<Record<PropertyForSetName, SetProperty>>;

export type ExerciseSetRelations = {
  properties?: PropertyMap;
};

export type ExerciseSetWithRelations = ExerciseSetSchema & ExerciseSetRelations;

export default class ExerciseSet implements ExerciseSetSchema {
  protected _id: number;
  protected _listOrder: number;
  protected _exerciseId: number;
  protected _actualWeight: string | null;
  protected _actualReps: number | null;
  protected _actualExertion: number | null;
  protected _weightUnits: WeightUnit | null;
  protected _exertionUnits: ExertionUnit | null;
  protected _properties: PropertyMap | null;

  constructor(attributes: ExerciseSetWithRelations) {
    this._id = attributes.id;
    this._listOrder = attributes.listOrder;
    this._exerciseId = attributes.exerciseId;
    this._actualWeight = attributes.actualWeight;
    this._actualReps = attributes.actualReps;
    this._actualExertion = attributes.actualExertion;
    this._weightUnits = attributes.weightUnits;
    this._exertionUnits = attributes.exertionUnits;
    this._properties = attributes.properties || null;
  }

  static async create(
    attributes: NewExerciseSetSchema
  ): Promise<DbModelResponse<ExerciseSet>> {
    const result = await db.transaction(async (tx) => {
      let setSchema: ExerciseSetSchema;
      try {
        [setSchema] = await tx
          .insert(exerciseSets)
          .values(attributes)
          .returning();
      } catch (err) {
        return ExerciseSet._setCreateResult({
          error: errorResponse(err, "ExerciseSet.create"),
        });
      }
      return ExerciseSet._setCreateResult({ setSchema });
    });

    if (result.error) {
      return dbModelResponse({ errorMessage: result.error });
    }

    const exerciseSet = new ExerciseSet({
      ...(result.setSchema as ExerciseSetSchema),
    });

    return dbModelResponse({ value: exerciseSet });
  }

  static _setCreateResult(result: Partial<SetUpsertResult>): SetUpsertResult {
    return {
      error: result.error || null,
      setSchema: result.setSchema || null,
    };
  }

  async getProperties() {
    if (this.properties) {
      return this.properties;
    }

    const propertyJoinSchemas = await db
      .select()
      .from(setProperties)
      .innerJoin(
        propertiesForSets,
        eq(setProperties.propertyId, propertiesForSets.id)
      )
      .where(eq(setProperties.setId, this.id));

    let properties: PropertyMap = {};
    propertyJoinSchemas.forEach((pjs) => {
      properties[pjs.properties_for_sets.name] = new SetProperty({
        ...pjs.set_properties,
        property: pjs.properties_for_sets,
        set: this,
      });
    });

    this.properties = properties;
    return this.properties;
  }

  async setProperty(propertyName: PropertyForSetName, newValue: string) {
    const exerciseSetProperties = await this.getProperties();
    const property = exerciseSetProperties[propertyName];
    let result: DbModelResponse<SetProperty>;

    if (property) {
      result = await property.updatePropertyValue(newValue);
    } else {
      result = await this.addProperty(propertyName, newValue);
    }
  }

  async addProperty(name: PropertyForSetName, value: string) {
    const setProperties = await this.getProperties();
    const setProperty = setProperties[name];
    if (setProperty || !value) {
      return dbModelResponse<SetProperty>({
        errorMessage: "Property already exists or value is null",
      });
    }

    const { value: newProperty, errorMessage } = await SetProperty.create({
      setId: this.id,
      propertyName: name,
      value,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    this._updatePropertiesMap({ [newProperty!.name]: newProperty });
    return dbModelResponse<SetProperty>({ value: newProperty! });
  }

  async removeProperty(name: PropertyForSetName): Promise<RemoveResponse> {
    const setProperties = await this.getProperties();
    const setProperty = setProperties[name];
    if (!setProperty) {
      return {
        status: ResponseStatus.FAILURE,
        errorMessage: `No property ${name} on set ${this.id}`,
      };
    }

    const { status, errorMessage } = await setProperty.remove();

    if (status === ResponseStatus.FAILURE) {
      return {
        status,
        errorMessage,
      };
    } else {
      delete setProperties[name];
      return {
        status: ResponseStatus.SUCCESS,
        errorMessage: null,
      };
    }
  }

  async _updatePropertiesMap(newPropertyMap: {
    [K in PropertyForSetName]?: SetProperty;
  }) {
    const setPropertiesMap = await this.getProperties();
    Object.assign(setPropertiesMap, newPropertyMap);
  }

  // Getters
  public get id() {
    return this._id;
  }

  public get listOrder() {
    return this._listOrder;
  }

  public get exerciseId() {
    return this._exerciseId;
  }

  public get actualWeight() {
    return this._actualWeight;
  }

  public get actualReps() {
    return this._actualReps;
  }

  public get actualExertion() {
    return this._actualExertion;
  }

  public get weightUnits() {
    return this._weightUnits;
  }

  public get exertionUnits() {
    return this._exertionUnits;
  }

  public get properties() {
    return this._properties;
  }

  // Setters
  public set id(userId: number) {
    this._id = userId;
  }

  public set listOrder(order: number) {
    this._listOrder = order;
  }

  public set exerciseId(exerciseId: number) {
    this._exerciseId = exerciseId;
  }

  public set actualWeight(weight: string | null) {
    this._actualWeight = weight;
  }

  public set actualReps(reps: number | null) {
    this._actualReps = reps;
  }

  public set actualExertion(exertion: number | null) {
    this._actualExertion = exertion;
  }

  public set weightUnits(units: WeightUnit | null) {
    this._weightUnits = units;
  }

  public set exertionUnits(units: ExertionUnit | null) {
    this._exertionUnits = units;
  }

  public set properties(properties: PropertyMap | null) {
    this._properties = properties;
  }
}
