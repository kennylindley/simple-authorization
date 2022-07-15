import SimpleAuthorization from "..";
/**
 * Utility function for the `policy` helper for putting together the data needed by the policies.
 *
 * @param {Function|object|string} classOrRecord The class, class name, or instance of a class
 * @param {object} recordAttributes The plain object representing the record when given a class or class name
 * @returns {object} The policy instance based on the record
 */
function getPolicyData(classOrRecord, recordAttributes) {
  let policyData = {};

  try {
    policyData = SimpleAuthorization.policyData();
  } catch (error) {
    throw new Error("SimpleAuthorization.policyData must be set to a function that returns an object");
  }

  switch (typeof classOrRecord) {
    case "object":
      policyData.modelName = classOrRecord.constructor.name;
      policyData.record = classOrRecord;

      return policyData;
    case "function":
      policyData.modelName = classOrRecord.name;
      policyData.record = recordAttributes;

      return policyData;
    default:
      policyData.modelName = classOrRecord;
      policyData.record = recordAttributes;

      return policyData;
  }
}

export default getPolicyData;
