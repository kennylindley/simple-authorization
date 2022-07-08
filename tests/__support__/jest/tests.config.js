const common = require("./common.config");

module.exports = {
  ...common,
  displayName: "Tests",
  runner: "jest-runner",
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/tests/**/*.spec.js"]
};
