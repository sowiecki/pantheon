export default () => (next) => (action) => {
  switch (action.type) {
    default:
      next(action);
      break;
  }
};
