const getErrorMessage = function (error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

const getError = function (error: unknown) {
  if (error instanceof Error) {
    return error;
  }
  return new Error(error as string);
};

declare global {
  function getErrorMessage(error: unknown): string;
  function getError(error: unknown): Error;
}

global.getErrorMessage = getErrorMessage;
global.getError = getError;

export {};
