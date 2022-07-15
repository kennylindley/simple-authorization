import { Authorize } from "../../src";
import policy from "../../src/simple-authorization/policy";
import React from "react";
import { shallow } from "enzyme";

let mockPolicyInstance;

jest.mock("../../src/simple-authorization/policy", () => {
  return jest.fn().mockImplementation(() => {
    return mockPolicyInstance;
  });
});

afterEach(() => {
  Authorize.instances = [];
  policy.mockClear();
});

describe("Authorize#componentDidMount", () => {
  beforeEach(() => {
    mockPolicyInstance = { view: jest.fn() };
  });

  it("adds the component instance to Authorize.instances", () => {
    const component = shallow(
      <Authorize on="UserBoard" perform="view">
        <div className="user-board" />
      </Authorize>,
      { disableLifecycleMethods: true }
    );
    const instance = component.instance();

    instance.componentDidMount();

    expect(Authorize.instances).toEqual([instance]);
  });
});

describe("Authorize#componentWillUnmount", () => {
  beforeEach(() => {
    mockPolicyInstance = { view: jest.fn() };
  });

  it("removes the component instance to Authorize.instances", () => {
    const component = shallow(
      <Authorize on="UserBoard" perform="view">
        <div className="user-board" />
      </Authorize>,
      { disableLifecycleMethods: true }
    );
    const instance = component.instance();

    Authorize.instances = [{}, {}, instance, {}];
    instance.componentWillUnmount();

    expect(Authorize.instances).toEqual([{}, {}, {}]);
  });
});

describe("Authorize#isPermitted", () => {
  beforeEach(() => {
    mockPolicyInstance = { new: jest.fn(), update: jest.fn() };
  });

  describe("when the 'containing' prop is given", () => {
    it("passes the 'on' prop and 'containing' prop to call the 'perform' prop on the matching policy", () => {
      mockPolicyInstance.update.mockReturnValue(true);

      const component = shallow(
        <Authorize containing={{ id: 5 }} on="User" perform="update">
          <button className="update-user" />
        </Authorize>
      );
      mockPolicyInstance.update.mockClear();
      policy.mockClear();

      expect(component.instance().isPermitted()).toBe(true);
      expect(policy.mock.calls).toEqual([["User", { id: 5 }]]);
      expect(mockPolicyInstance.update.mock.calls).toHaveLength(1);
    });

    it("returns the opposite boolean if the `cannot` prop is used", () => {
      mockPolicyInstance.update.mockReturnValue(true);

      const component = shallow(
        <Authorize cannot containing={{ id: 5 }} on="User" perform="update">
          <button className="update-user" />
        </Authorize>
      );

      expect(component.instance().isPermitted()).toBe(false);
    });
  });

  describe("when the 'containing' prop is not given", () => {
    it("passes the 'on' prop to call the 'perform' prop on the matching policy", () => {
      mockPolicyInstance.new.mockReturnValue(false);

      const component = shallow(
        <Authorize on="user" perform="new">
          <button className="new-user" />
        </Authorize>
      );
      mockPolicyInstance.new.mockClear();
      policy.mockClear();

      expect(component.instance().isPermitted()).toBe(false);
      expect(policy.mock.calls).toEqual([["user"]]);
      expect(mockPolicyInstance.new.mock.calls).toHaveLength(1);
    });

    it("returns the opposite boolean if the `cannot` prop is used", () => {
      mockPolicyInstance.update.mockReturnValue(true);

      const component = shallow(
        <Authorize cannot on="user" perform="new">
          <button className="new-user" />
        </Authorize>
      );

      expect(component.instance().isPermitted()).toBe(true);
    });
  });
});

describe("Authorize#render", () => {
  beforeEach(() => {
    mockPolicyInstance = { view: jest.fn() };
  });

  it("renders the child components when the user is permitted", () => {
    mockPolicyInstance.view.mockReturnValue(true);

    const component = shallow(
      <Authorize on="UserBoard" perform="view">
        <div className="user-board" />
      </Authorize>
    );

    expect(component.instance().render()).toEqual(<div className="user-board" />);
  });

  it("returns `null` when the user is not permitted", () => {
    mockPolicyInstance.view.mockReturnValue(false);

    const component = shallow(
      <Authorize on="UserBoard" perform="view">
        <div className="user-board" />
      </Authorize>
    );

    expect(component.instance().render()).toBeNull();
  });
});

describe("Authorize.forceUpdateAll", () => {
  beforeEach(() => {
    mockPolicyInstance = { view: jest.fn() };
  });

  it("calls `forceUpdate` on each of the mounted Authorize instances", () => {
    const component1 = shallow(
      <Authorize on="UserBoard" perform="view">
        <div className="user-board" />
      </Authorize>
    );
    const instance1 = component1.instance();
    jest.spyOn(instance1, "forceUpdate");

    const component2 = shallow(
      <Authorize on="UserBoard" perform="view">
        <div className="user-board" />
      </Authorize>
    );
    const instance2 = component2.instance();
    jest.spyOn(instance2, "forceUpdate");

    Authorize.forceUpdateAll();

    expect(instance1.forceUpdate.mock.calls).toHaveLength(1);
    expect(instance2.forceUpdate.mock.calls).toHaveLength(1);
  });
});
