export const getPositions = (stripLength) => new Array(stripLength).fill(0).map((x, i) => i);

/**
 * @param {object} state
 * @param {object} action
 * @returns {object} newState
 */
export const registerAccessories = (state, { accessories }) => {
  const newState = { ...state };

  Object.keys(accessories).forEach((accessoryKey) => {
    newState[accessoryKey] = accessories[accessoryKey];
  });

  return newState;
};
