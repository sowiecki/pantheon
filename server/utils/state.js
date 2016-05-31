export const handleAction = (state, action, reducers) => (
  reducers[action.type] ? reducers[action.type]() : state
);
