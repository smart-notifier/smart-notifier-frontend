import fetch from "isomorphic-fetch";
import config from "../config";

const makeApiCall = (path, body, method = 'GET') => {
    let headers = {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    return fetch(path, {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    }).then(response => {
        return response.json().then(json => {
            if (!response.ok || json.error) {
                return Promise.reject(json)
            }
            return json;
        });
    });
};

export const CALL_API_KEY = "apiCallInfo";

export const CREATE_METHOD = "POST";
export const UPDATE_METHOD = "PUT";
export const DELETE_METHOD = "DELETE";

export default ({dispatch, getState}) => next => action => {

    if (!action.payload) {
        return next(action);
    }

    const apiCallDetails = action.payload[CALL_API_KEY];

    if (typeof apiCallDetails === "undefined") {
        return next(action);
    }

    const {path, body, method, types, actionCreatorOnSuccess, actionCreatorOnError} = apiCallDetails;

    if (typeof path !== 'string') {
        throw new Error('Specify a string endpoint URL.')
    }

    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types.')
    }

    if (!types.every(type => typeof type === 'function')) {
        throw new Error('Expected action types to be functions.')
    }

    const transformedAction = (actionCreator, data) => {
        return actionCreator(data);
    };

    const [requestType, successType, failureType] = types;
    next(transformedAction(requestType));

    return makeApiCall(`${config.apiBase}${path}`, body, method)
        .then(response => {
                next(transformedAction(successType, response));
                if (actionCreatorOnSuccess)
                    dispatch(actionCreatorOnSuccess(response));
            },
            error => {
                next(transformedAction(failureType, error));
                if (actionCreatorOnError)
                    dispatch(actionCreatorOnError(error));
            }
        );
}