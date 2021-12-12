import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from "redux-devtools-extension";
import throttle from 'lodash/throttle';
import rootReducer from "../reducers/index";
import { saveState } from './../localStorage';

const middleware = [thunk];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

store.subscribe(throttle(() => {
  saveState({
    Carts: store.getState().product.Carts,
  });
}, 1000));
export default store;