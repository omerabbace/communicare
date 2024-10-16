import { createStore, combineReducers } from 'redux';
import pollReducer from './reducers/pollReducer';
import donationReducer from './reducers/donationReducer';
import forumReducer from './reducers/forumReducer';

const rootReducer = combineReducers({
  poll: pollReducer,
  donation: donationReducer,
  forum: forumReducer,
});

const store = createStore(rootReducer);

export default store;
