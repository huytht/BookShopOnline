import { combineReducers } from 'redux';
import { product } from './product';
import auth from './auth';
import message from './message';

export default combineReducers({
    product,
    auth,
    message
});