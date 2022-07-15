import getPolicyData from "./get-policy-data";
import SimpleAuthorization from "..";

/**
 * Helper for returning the matching policy based on the given class name or record.
 *
 * @param {Function|object|string} classOrRecord The class, class name, or instance of a class
 * @param {object} recordAttributes The plain object representing the record when given a class or class name
 * @returns {object} The policy instance based on the record
 * @example
 *   // Checks against UserPolicy#new
 *   policy(User).new();
 *
 *   // Checks against StatusPolicy#update
 *   policy(new Status({ userId: 5 })).update();
 *
 *   // Checks against UserPolicy#update
 *   policy("User", { id: 5 }).update();
 */
function policy(classOrRecord, recordAttributes) {
  let policyData = getPolicyData(classOrRecord, recordAttributes);
  let PolicyClass = SimpleAuthorization.policyResolver(policyData.modelName);

  if (typeof PolicyClass === "function") {
    return new PolicyClass(policyData);
  }

  throw new Error("SimpleAuthorization.policyResolver could not resolve a policy class for " + policyData.modelName);
}

export default policy;
