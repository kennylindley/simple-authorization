import policy from "./policy";
import PropTypes from "prop-types";
import React from "react";

/**
 * Component for conditionally rendering child components based on the current user's permissions.
 *
 * @example
 *   // Checks against UserPolicy#new
 *   <Authorize perform="new" on={User}>
 *     <button>New User</button>
 *   </Authorize>
 *
 *   // Checks against StatusPolicy#update
 *   <Authorize perform="update" on={new Status({ userId: 1 })}>
 *     <button>Update Status</button>
 *   </Authorize>
 *
 *   // Checks against UserPolicy#update
 *   <Authorize perform="update" on="User" containing={{ id: 5 }}>
 *     <button>Edit User</button>
 *   </Authorize>
 */
class Authorize extends React.Component {
  /**
   * Adds the instance to the instances array so it can be re-rendered when the policy data changes.
   */
  componentDidMount() {
    Authorize.instances.push(this);
  }

  /**
   * Removes the instance from the instances array to remove it from being re-rendered on policy data changes.
   */
  componentWillUnmount() {
    let index = Authorize.instances.indexOf(this);
    Authorize.instances.splice(index, 1);
  }

  /**
   * Returns whether the user is permitted to perform the action.
   *
   * @returns {boolean} Whether the user is permitted
   */
  isPermitted() {
    let isPermitted;

    if (this.props.containing == null) {
      isPermitted = policy(this.props.on)[this.props.perform]();
    } else {
      isPermitted = policy(this.props.on, this.props.containing)[this.props.perform]();
    }

    return this.props.cannot ? !isPermitted : isPermitted;
  }

  /**
   * Conditionally renders the child components based on the user's permissions.
   *
   * @returns {object|null} The React element or null if not permitted
   */
  render() {
    if (this.isPermitted()) {
      return this.props.children;
    }

    return null;
  }
}

/**
 * Force updates all mounted instances of the Authorize component.
 */
Authorize.forceUpdateAll = () => {
  for (let i = 0; i < Authorize.instances.length; i++) {
    Authorize.instances[i].forceUpdate();
  }
};

Authorize.instances = [];

Authorize.propTypes = {
  cannot: PropTypes.bool,
  containing: PropTypes.object,
  on: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.string]).isRequired,
  perform: PropTypes.string.isRequired,
};

export default Authorize;
