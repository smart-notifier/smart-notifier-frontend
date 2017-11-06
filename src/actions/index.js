import {createActions} from "redux-actions";

import {CALL_API_KEY} from "../middleware/api";
import config from "../config";
import {merge} from "lodash/object";

const createApiAction = (req, succ, fail, path) => (() => ({
    [CALL_API_KEY]: {
        types: [req, succ, fail],
        path: path
    }
}));

const simpleApiActions = createActions({
    API: {
        UPWORK_FEED_REQUEST: undefined,
        UPWORK_FEED_SUCCESS: undefined,
        UPWORK_FEED_FAILURE: undefined
    },
});

const actionCreators = createActions({
    BASIC: {
        REFETCH_DATA: undefined,
    },
    API: {
        UPWORK_FEED_REQUEST: undefined,
        UPWORK_FEED_SUCCESS: undefined,
        UPWORK_FEED_FAILURE: undefined,
        FETCH_UPWORK_FEED: createApiAction(simpleApiActions.api.upworkFeedRequest, simpleApiActions.api.upworkFeedSuccess, simpleApiActions.api.upworkFeedFailure, config.paths.feeds.upwork)
    },
    NOTIFICATIONS_BOARD: {
        UI_TOGGLE_VISIBILITY_ITEM_FROM_FEED_TABLE: undefined,
        UI_TOGGLE_EXPAND_UPWORK_FEED_ROW: undefined,
        UI_BEEP_FOR_LAST_BATCH: undefined,
    }
});

export default merge(actionCreators, simpleApiActions);