/**
 * Response expected from methods which mutate db data
 */
export type DbModelResponse<T> = {
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
  attr: Partial<DbModelResponse<T>>
): DbModelResponse<T> {
  return {
    errorMessage: attr.errorMessage || null,
    value: attr.value || null,
  };
}

export function errorResponse(err: unknown, location: string) {
  return `${location}: ` + getErrorMessage(err);
}
