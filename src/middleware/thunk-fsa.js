import {isFSA} from 'flux-standard-action';

export default ({dispatch, getState}) => next => action => {
    if (isFSA(action)) {
        if (typeof action.payload === "function") {
            return next(action.payload);
        }
    }

    return next(action);
};