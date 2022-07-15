import SimpleAuthorization from "../src";
import { Authorize, getPolicyData, policy } from "../src";

const module = require("../src");

describe("module", () => {
  it("returns proper components", () => {
    expect(module).toEqual({ Authorize, default: SimpleAuthorization, getPolicyData, policy });
  });
});
