import {createActions} from "redux-actions";

import {CALL_API_KEY} from "../middleware/api";
import config from "../config";

export const UPWORK_FEED_REQUEST = 'UPWORK_FEED_REQUEST';
export const UPWORK_FEED_SUCCESS = 'UPWORK_FEED_SUCCESS';
export const UPWORK_FEED_FAILURE = 'UPWORK_FEED_FAILURE';

export const REFETCH_DATA = 'REFETCH_DATA';
export const UI_NOTIFICATIONS_BOARD_TOGGLE_EXPAND_UPWORK_FEED_ROW = 'UI_NOTIFICATIONS_BOARD_TOGGLE_EXPAND_UPWORK_FEED_ROW';

const createApiAction = (req, succ, fail, path) => (()=>({
    [CALL_API_KEY]: {
        types: [req, succ, fail],
        path: path
    }
}));

const fetchUpworkFeed = createApiAction(UPWORK_FEED_REQUEST, UPWORK_FEED_SUCCESS, UPWORK_FEED_FAILURE, config.paths.feeds.upwork);

export const {refetchData, uiNotificationsBoardToggleExpandUpworkFeedRow} = createActions(REFETCH_DATA, UI_NOTIFICATIONS_BOARD_TOGGLE_EXPAND_UPWORK_FEED_ROW);

export const refreshNotifications = () => (dispatch) => {
    dispatch(fetchUpworkFeed());
};