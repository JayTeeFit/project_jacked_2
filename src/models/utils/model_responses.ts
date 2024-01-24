/**
 * Response expected from methods which mutate db data
 */
export type DbUpsertModelResponse<T> = {
  errorMessage: string | null;
  value: T | null;
};

export enum ResponseStatus {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE,",
}

export type RemoveResponse = {
  status: ResponseStatus;
  errorMessage: string | null;
};

export function dbModelResponse<T>(
  attr: Partial<DbUpsertModelResponse<T>>
): DbUpsertModelResponse<T> {
  return {
    errorMessage: attr.errorMessage || null,
    value: attr.value || null,
  };
}

export function errorResponse(err: unknown) {
  return getErrorMessage(err) || "unknown error";
}
