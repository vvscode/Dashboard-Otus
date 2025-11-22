/** @type {import('jest').Config} */
export default {
  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: "coverage",

  coverageProvider: "babel",

  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  testEnvironment: "jsdom",

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
  },

  globals: {
    PREFIX: ''
  },
};
