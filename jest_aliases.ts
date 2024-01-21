function suite(
  name: string | number | Function | jest.FunctionLike,
  fn: jest.EmptyFunction
) {
  describe(name, fn);
}

declare global {
  function suite(
    name: string | number | Function | jest.FunctionLike,
    fn: jest.EmptyFunction
  ): void;
}

global.suite = suite;

export {};
