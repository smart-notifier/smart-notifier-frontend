import {handleActions} from "redux-actions";
import {UI_NOTIFICATIONS_BOARD_TOGGLE_EXPAND_UPWORK_FEED_ROW, UPWORK_FEED_FAILURE, UPWORK_FEED_REQUEST, UPWORK_FEED_SUCCESS} from "../actions/index";
import {xorWith} from "lodash/array";
import {isEqual} from "lodash/lang";

const feedsReducer = handleActions({
    [UPWORK_FEED_REQUEST]: (state, action) => {
        let progressing = Object.assign({}, state.progressing, {UPWORK_FEED_REQUEST});
        return Object.assign({}, state, {progressing});
    },
    [UPWORK_FEED_SUCCESS]: (state, action) => {
        let progressing = Object.assign({}, state.progressing);
        delete progressing[UPWORK_FEED_REQUEST];

        let current = [...action.payload];
        let previous = [...state.upwork.previous];

        let diff = xorWith(current, previous, (curr, prev) => {
            let eq = isEqual(curr, prev);
            if (eq) {
                curr.isNew = false;
                prev.isNew = false;
            } else {
                curr.isNew = true;
                prev.isNew = false;
            }
            return eq;
        });

        return Object.assign({}, state, {
            progressing,
            upwork: {diff, current, previous}
        });
    },

    [UPWORK_FEED_FAILURE]: (state, action) => {
        let progressing = Object.assign({}, state.progressing);
        delete progressing[UPWORK_FEED_REQUEST];

        return Object.assign({}, state, {progressing});
    },

    [UI_NOTIFICATIONS_BOARD_TOGGLE_EXPAND_UPWORK_FEED_ROW]: (state, action) => {
        let expandAtIndex = action.payload;
        let currentFromState = state.upwork.current;
        let expanded = Object.assign({}, currentFromState[expandAtIndex], {expanded: !currentFromState[expandAtIndex].expanded});

        let current = [...currentFromState];
        current[expandAtIndex] = expanded;

        let upwork = Object.assign({}, state.upwork, {current});

        return Object.assign({}, state, {upwork});
    },
}, {
    progressing: {},
    upwork: {
        diff: [],
        current: [],
        previous: []
    }
});

export default feedsReducer;