const getErrorMessage = function (error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

declare global {
  function getErrorMessage(error: unknown): string;
}

global.getErrorMessage = getErrorMessage;

export {};
