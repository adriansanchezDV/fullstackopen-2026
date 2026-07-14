
import { createStore } from 'redux';
import anecdotesReducer from './reducers/anecdoteReducer';
import filterReducer from './reducers/filterReducer';
import { combineReducers } from 'redux';

const reducer = combineReducers({
  anecdotes: anecdotesReducer,
  filter: filterReducer
})


const store = createStore(reducer);

export default store;