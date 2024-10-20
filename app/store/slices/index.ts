import { combineReducers } from 'redux';
import meSlice from './me';

const rootReducer = combineReducers({
  me: meSlice,
});

export default rootReducer;