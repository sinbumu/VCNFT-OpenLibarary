import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: 'ts-jest', // ts-jest를 사용하도록 설정
  testEnvironment: "node", // Node.js 환경 설정
  testSequencer: './testSequencer.js',
};

export default config;
