import { createStore, combineReducers } from "redux";
import noteReducer from "./reducers/noteReducer";

import filterReducer from "./reducers/filterReducer";


const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(reducer)


export default store;
