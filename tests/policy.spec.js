let SimpleAuthorization = require("../src");
let UserPolicy = require("./__support__/policies/UserPolicy");
let { policy } = SimpleAuthorization;

/**
 * Class for testing that the policy function throws errors when a matching policy can't be found.
 */
class MockMissingClass {}

/**
 * Class for testing that we don't catch errors thrown in a policy's constructor.
 */
class MockPolicyWithError {
  /**
   *
   */
  constructor() {
    throw new Error("mock error in policy constructor");
  }
}

/**
 * Class for testing that the UserPolicy is returned from the policy resolver.
 */
class User {}

beforeEach(() => {
  SimpleAuthorization.policyData = () => {
    return { currentUser: { id: 1 }, role: { createPost: true, deletePost: false, id: 2 } };
  };

  SimpleAuthorization.policyResolver = (modelName) => {
    switch (modelName) {
      case "MockModelNameWithError":
        return MockPolicyWithError;
      case "User":
        return UserPolicy;
      default:
    }
  };
});

describe("policy", () => {
  it("returns an instance of the matching policy class when given a string", () => {
    let userPolicy = policy("User");

    expect(userPolicy).toEqual(expect.any(UserPolicy));
    expect(userPolicy.currentUser.id).toBe(1);
    expect(userPolicy.record).toBeUndefined();
    expect(userPolicy.role.id).toBe(2);
  });

  it("accepts an object for dynamic behavior when given a string", () => {
    let userPolicy = policy("User", { id: 100 });

    expect(userPolicy.record).toEqual({ id: 100 });
  });

  it("returns an instance of the matching policy class when given a class", () => {
    let userPolicy = policy(User);

    expect(userPolicy).toEqual(expect.any(UserPolicy));
    expect(userPolicy.currentUser.id).toBe(1);
    expect(userPolicy.record).toBeUndefined();
    expect(userPolicy.role.id).toBe(2);
  });

  it("accepts an object for dynamic behavior when given a class", () => {
    let userPolicy = policy(User, { id: 100 });

    expect(userPolicy.record).toEqual({ id: 100 });
  });

  it("returns an instance of the matching policy class when given an instance of a class", () => {
    let user = new User();
    let userPolicy = policy(user);

    expect(userPolicy).toEqual(expect.any(UserPolicy));
    expect(userPolicy.currentUser.id).toBe(1);
    expect(userPolicy.record).toBe(user);
    expect(userPolicy.role.id).toBe(2);
  });

  it("raises an error if the SimpleAuthorization.policyData is not set to a function", () => {
    delete SimpleAuthorization.policyData;

    expect(() => {
      policy("User");
    }).toThrow("SimpleAuthorization.policyData must be set to a function that returns an object");
  });

  it("raises an error if a matching policy cannot be found", () => {
    expect(() => {
      policy("MockMissingClass");
    }).toThrow("SimpleAuthorization.policyResolver could not resolve a policy class for MockMissingClass");

    expect(() => {
      policy(MockMissingClass);
    }).toThrow("SimpleAuthorization.policyResolver could not resolve a policy class for MockMissingClass");

    expect(() => {
      policy(new MockMissingClass());
    }).toThrow("SimpleAuthorization.policyResolver could not resolve a policy class for MockMissingClass");
  });

  it("raises the original error if there's an issue initializing the policy class", () => {
    expect(() => {
      policy("MockModelNameWithError");
    }).toThrow("mock error in policy constructor");
  });
});
