import { and, eq } from "drizzle-orm";
import { ExerciseSetSchema } from "src/db/schema/exercise_sets/exercise_sets";
import { PropertyForSetSchema } from "src/db/schema/exercise_sets/properties_for_sets";
import {
  NewSetPropertySchema,
  SetPropertySchema,
  setProperties,
} from "src/db/schema/exercise_sets/set_properties";
import { DataType } from "src/db/schema/types/dynamic_properties";
import { PropertyForSetName } from "src/db/schema/types/sets";
import ExerciseSet from "src/models/exercise_set/exercise_set";
import PropertyForSet from "src/models/exercise_set/property_for_set";
import { cleanAndValidateValueInput } from "src/models/utils/dynamic_property_helpers";
import {
  DbModelResponse,
  RemoveResponse,
  ResponseStatus,
  dbModelResponse,
  errorResponse,
} from "src/models/utils/model_responses";

export type CreateSetProperty = {
  setId: number;
  propertyName: PropertyForSetName;
  value: string;
};

type PropertyUpsertResult = {
  error: string | null;
  setPropertySchema: SetPropertySchema | null;
};

export type SetPropertyRelations = {
  property: PropertyForSetSchema | PropertyForSet;
  set?: ExerciseSetSchema | ExerciseSet | null;
};

export type SetPropertyWithRelations = SetPropertySchema & SetPropertyRelations;

export type SetPropertyInterface = SetPropertySchema &
  Omit<PropertyForSetSchema, "id">;

export default class SetProperty implements SetPropertyInterface {
  protected _value: string | null;
  protected _setId: number;
  protected _propertyId: number;
  protected _name: PropertyForSetName;
  protected _dataType: DataType;
  protected _set: ExerciseSet | null;
  protected _property: PropertyForSet;

  constructor(attributes: SetPropertyWithRelations) {
    this._value = attributes.value;
    this._propertyId = attributes.propertyId;
    this._setId = attributes.setId;
    // set
    if (!attributes.set || attributes.set instanceof ExerciseSet) {
      this._set = attributes.set || null;
    } else {
      this._set = new ExerciseSet(attributes.set);
    }
    // property
    if (attributes.property instanceof PropertyForSet) {
      this._property = attributes.property;
    } else {
      this._property = new PropertyForSet(attributes.property);
    }

    this._name = this._property.name;
    this._dataType = this._property.dataType;
  }

  static async create(
    attributes: CreateSetProperty
  ): Promise<DbModelResponse<SetProperty>> {
    let property: PropertyForSet | null;

    property = await PropertyForSet.findPropertyByName(attributes.propertyName);

    if (!property) {
      return dbModelResponse({
        errorMessage: `No property ${attributes.propertyName} exists`,
      });
    }

    let newPropertySchema: NewSetPropertySchema = {
      setId: attributes.setId,
      propertyId: property.id,
      value: cleanAndValidateValueInput(attributes.value, property.dataType),
    };

    if (!newPropertySchema.value) {
      return dbModelResponse({
        errorMessage: `${attributes.value} is not a valid input for ${property.name}`,
      });
    }

    const result = await db.transaction(async (tx) => {
      let setPropertySchema: SetPropertySchema;

      try {
        [setPropertySchema] = await tx
          .insert(setProperties)
          .values(newPropertySchema)
          .returning();
      } catch (err) {
        return SetProperty._propertyUpsertResult({
          error: errorResponse(err),
        });
      }
      return SetProperty._propertyUpsertResult({
        setPropertySchema,
      });
    });

    if (result.error) {
      return dbModelResponse({ errorMessage: result.error });
    }

    const setProperty = new SetProperty({
      ...(result.setPropertySchema as SetPropertySchema),
      property,
    });

    return dbModelResponse({ value: setProperty });
  }

  static _propertyUpsertResult(
    result: Partial<PropertyUpsertResult>
  ): PropertyUpsertResult {
    return {
      error: result.error || null,
      setPropertySchema: result.setPropertySchema || null,
    };
  }

  async updatePropertyValueOrRemove(
    value: string | null
  ): Promise<DbModelResponse<SetProperty>> {
    const cleanValue = cleanAndValidateValueInput(value, this.dataType);

    if (!cleanValue) {
      this.remove();
    }

    if (cleanValue === this.value) {
      return dbModelResponse<SetProperty>({ value: this });
    }

    const result = await db.transaction(async (tx) => {
      let setPropertySchema: SetPropertySchema;
      try {
        [setPropertySchema] = await tx
          .update(setProperties)
          .set({ value: cleanValue })
          .where(
            and(
              eq(setProperties.setId, this.setId),
              eq(setProperties.propertyId, this.propertyId)
            )
          )
          .returning();
      } catch (err) {
        return SetProperty._propertyUpsertResult({
          error: errorResponse(err),
        });
      }

      return SetProperty._propertyUpsertResult({
        setPropertySchema,
      });
    });

    if (result.error) {
      return dbModelResponse<SetProperty>({ errorMessage: result.error });
    }

    this._updateSetPropertyfields({
      value: (result.setPropertySchema as SetPropertySchema).value,
    });

    return dbModelResponse<SetProperty>({ value: this });
  }

  async remove() {
    const result: RemoveResponse = await db.transaction(async (tx) => {
      try {
        await tx
          .delete(setProperties)
          .where(
            and(
              eq(setProperties.setId, this.setId),
              eq(setProperties.propertyId, this.propertyId)
            )
          );
      } catch (err) {
        return {
          status: ResponseStatus.FAILURE,
          errorMessage: errorResponse(err),
        };
      }
      return {
        status: ResponseStatus.SUCCESS,
        errorMessage: null,
      };
    });

    return result;
  }

  _updateSetPropertyfields(properties: Partial<SetPropertyInterface>) {
    Object.assign(this, properties);
  }

  // Getters
  public get value() {
    return this._value;
  }

  public get setId() {
    return this._setId;
  }

  public get propertyId() {
    return this._propertyId;
  }

  public get set() {
    return this._set;
  }

  public get name() {
    return this._name;
  }

  public get dataType() {
    return this._dataType;
  }

  // Setters
  public set value(value: string | null) {
    this._value = value;
  }

  public set propertyId(propertyId: number) {
    this._propertyId = propertyId;
  }

  public set setId(setId: number) {
    this._setId = setId;
  }

  public set set(set: ExerciseSet | null) {
    this._set = set;
  }

  public set name(name: PropertyForSetName) {
    this._name = name;
  }

  public set dataType(dataType: DataType) {
    this._dataType = dataType;
  }
}
