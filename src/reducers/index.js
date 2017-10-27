import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import feedsReducer from "./feedsReducer";

export default combineReducers({
    feeds: feedsReducer,
    router: routerReducer
});