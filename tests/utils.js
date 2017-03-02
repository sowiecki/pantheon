import { mockGroups } from 'tests/mocks';

const genMockGroup = (props) => () => new Promise((resolve) => resolve(props));

export const genBridge = (props, index) => ({
  [`192.168.1.${index}`]: {
    bridge: { groups: genMockGroup(props) }
  }
});

const initialMockBridge = genBridge(mockGroups, 0);
const mockBridges = mockGroups.reduce((accumulated, mockBridge, index) => ({
  ...accumulated,
  ...genBridge(mockBridge, index)
}), initialMockBridge);

export const genMockStore = {
  getState: () => ({
    meta: {
      hue: {
        userIds: ['foo', 'bar'],
        ...mockBridges
      }
    }
  })
};
