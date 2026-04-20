/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // convex/_generated/ is gitignored (produced by `npx convex dev`).
    // Point Jest at a minimal stub so that import paths resolve correctly.
    // Tests that need specific API shapes must provide a jest.mock(..., factory)
    // — the stub itself only exports empty objects and is never used directly.
    '^.*convex/_generated/api$': '<rootDir>/src/__mocks__/convex-generated-api.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      jsx: 'react-jsx',
    }],
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.test.{ts,tsx}',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};

module.exports = config;
