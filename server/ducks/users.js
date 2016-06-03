import { handleAction } from '../utils';

export const EMIT_ADD_USER = 'EMIT_ADD_USER';

const initialState = {
  users: {}
};

const usersReducer = (state = initialState, action) => {
  const reducers = {
    [EMIT_ADD_USER]() {
      return state;
    }
  };

  return handleAction(state, action, reducers);
};

export default usersReducer;
