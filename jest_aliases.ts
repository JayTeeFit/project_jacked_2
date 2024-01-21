function suite(
  name: string | number | Function | jest.FunctionLike,
  fn: jest.EmptyFunction
) {
  describe(name, fn);
}

function skipSuite(
  name: string | number | Function | jest.FunctionLike,
  fn: jest.EmptyFunction
) {
  describe.skip(name, fn);
}

declare global {
  function suite(
    name: string | number | Function | jest.FunctionLike,
    fn: jest.EmptyFunction
  ): void;
  function skipSuite(
    name: string | number | Function | jest.FunctionLike,
    fn: jest.EmptyFunction
  ): void;
}

global.suite = suite;
global.skipSuite = skipSuite;

export {};
