/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest_console_fix.ts"],
  moduleDirectories: ["node_modules", "<rootDir>"],
};
