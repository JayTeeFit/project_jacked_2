import {
  NewPropertyForSetSchema,
  PropertyForSetSchema,
  propertiesForSets,
} from "src/db/schema/exercise_sets/properties_for_sets";
import { DataType } from "src/db/schema/types/dynamic_properties";
import {
  DbUpsertModelResponse,
  dbModelResponse,
  errorResponse,
} from "src/models/utils/model_responses";

type PropertyUpsertResult = {
  error: string | null;
  propertySchema: PropertyForSetSchema | null;
};

export type PropertyForSetRelations = {};

export type PropertyForSetWithRelations = PropertyForSetSchema &
  PropertyForSetRelations;

export default class PropertyForSet implements PropertyForSetSchema {
  private _id: number;
  private _name: string;
  private _dataType: DataType;

  constructor(attributes: PropertyForSetWithRelations) {
    this._id = attributes.id;
    this._name = attributes.name;
    this._dataType = attributes.dataType;
  }

  static async create(
    attributes: NewPropertyForSetSchema
  ): Promise<DbUpsertModelResponse<PropertyForSet>> {
    const result = await db.transaction(async (tx) => {
      let propertySchema: PropertyForSetSchema;
      try {
        [propertySchema] = await tx
          .insert(propertiesForSets)
          .values(attributes)
          .returning();
      } catch (err) {
        return PropertyForSet._propertyCreateResult({
          error: errorResponse(err),
        });
      }
      return PropertyForSet._propertyCreateResult({ propertySchema });
    });

    if (result.error) {
      return dbModelResponse({ errorMessage: result.error });
    }

    const property = new PropertyForSet({
      ...(result.propertySchema as PropertyForSetSchema),
    });

    return dbModelResponse({ value: property });
  }

  static _propertyCreateResult(
    result: Partial<PropertyUpsertResult>
  ): PropertyUpsertResult {
    return {
      error: result.error || null,
      propertySchema: result.propertySchema || null,
    };
  }

  // Getters
  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public get dataType() {
    return this._dataType;
  }

  // Getters
  public set id(id: number) {
    this._id = id;
  }

  public set name(name: string) {
    this._name = name;
  }

  public set dataType(type: DataType) {
    this._dataType = type;
  }
}
