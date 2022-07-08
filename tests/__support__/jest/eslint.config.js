const common = require("./common.config");

module.exports = {
  ...common,
  displayName: "ESLint",
  runner: "jest-runner-eslint",
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/*.js"]
};
