const path = require("path");
const ignorePatterns = ["/coverage/", "/node_modules/", "/tmp/", "<rootDir>/index.js"];

module.exports = {
  clearMocks: true,
  coveragePathIgnorePatterns: [...ignorePatterns, "/test"],
  rootDir: path.join(__dirname, "../../../"),
  setupFiles: ["<rootDir>/tests/__support__/enzyme.js"],
  snapshotSerializers: ["jest-snapshot-serializer-function-name"],
  testPathIgnorePatterns: ignorePatterns,
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  watchPathIgnorePatterns: ignorePatterns
};
