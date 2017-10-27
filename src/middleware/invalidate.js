import {LOCATION_CHANGE} from "react-router-redux";
import {CALL_API_KEY} from "./rss-service";
import {REFETCH_DATA} from "../actions/index";

let actionsStack = new Set();

export default ({dispatch, getState}) => next => action => {

    if (action.type === LOCATION_CHANGE) {
        actionsStack.clear();
    }

    if (action[CALL_API_KEY]) {
        actionsStack.add(action);
    }

    if (action.type === REFETCH_DATA) {
        actionsStack.forEach(fetchAction => dispatch(fetchAction));
    }

    return next(action);
}