const isWatchMode = process.argv[3] === "--watch";

const projects = [];
projects.push(require("./tests/__support__/jest/tests.config"));

// Only run the linters when not in watch mode
if (!isWatchMode) {
  projects.push(require("./tests/__support__/jest/eslint.config"));
}

module.exports = {
  collectCoverageFrom: ["./src/**/*.js"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  projects
};
