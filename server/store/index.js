import { createStore,
         applyMiddleware,
         combineReducers } from 'redux';

import reducers from '../ducks';
import api from '../middleware/api';

const rootReducer = combineReducers(reducers);

const configureStore = (initialState) => {
  const createStoreWithMiddleware = applyMiddleware(api)(createStore);

  return createStoreWithMiddleware(rootReducer, initialState);
};

const store = configureStore();
export default store;
