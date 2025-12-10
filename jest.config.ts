import { createDefaultPreset } from "ts-jest";
import { Config } from "jest";

const tsJestTransformCfg = createDefaultPreset().transform;

const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};

export default config;
