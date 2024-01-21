import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest_console_fix.ts", "./jest_aliases.ts"],
  moduleDirectories: ["node_modules", "<rootDir>"],
};

export default config;
