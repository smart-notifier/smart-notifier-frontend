import {combineActions, handleActions} from "redux-actions";
import actions from "../actions";
import {concat, differenceBy, findIndex, reverse, take} from "lodash/array";

import config from "../config";
import {sortBy} from "lodash/collection";

const mergeItemsBatchIntoTrail = (state, action, platform) => {
    let newState = removeFromProgressing(state, platform);

    let currentTrail = state.items;
    let newItemsBatchArray = action.payload;
    let maxTrailSize = config.feeds.maxTrailSize;

    let newItems = differenceBy(newItemsBatchArray, currentTrail, "guid");
    newItems.forEach(item => {
        item.platform = platform;
        item.isNew = true;
        item.hasDetails = false;
        item.isVisible = true;
    });

    let newTrail = take(
        reverse(
            sortBy(
                concat(newItems, currentTrail), item => (new Date(item.pubDate))
            )
        ), maxTrailSize);

    let shouldBeepForLastBatch = newItems.length > 0;
    return Object.assign(newState, {
        shouldBeepForLastBatch,
        items: newTrail
    });
};

const addToProgressing = (state, req) => {
    let progressing = [...state.progressing];
    progressing.push(req);
    return Object.assign({}, state, {progressing});
};

const removeFromProgressing = (state, req) => {
    let progressing = state.progressing.filter(item => item !== req);
    return Object.assign({}, state, {progressing});
};

const toggleFeedItemProp = (state, action, propName) => {
    let toggledItemGuid = action.payload;
    let currentTrail = state.items;

    let toggledItemIndex = findIndex(currentTrail, ['guid', toggledItemGuid]);
    let toggledItem = currentTrail[toggledItemIndex];

    let newItem = {...toggledItem};
    newItem[propName] = !toggledItem[propName];
    newItem.isNew = false;

    let newTrail = [...currentTrail];
    newTrail[toggledItemIndex] = newItem;

    return Object.assign({}, state, {items: newTrail});
};

const feedsReducer = handleActions({
    [combineActions(
        actions.api.upworkFeedRequest,
        actions.api.guruComFeedRequest
    )]: (state, action) => {
        return addToProgressing(state, action.type);
    },
    [combineActions(
        actions.api.upworkFeedFailure,
        actions.api.guruComFeedFailure
    )]: (state, action) => {
        return removeFromProgressing(state, action.type.replace("FAILURE", "REQUEST"));
    },
    [actions.api.upworkFeedSuccess]: (state, action) => {
        return mergeItemsBatchIntoTrail(state, action, config.platforms.upwork);
    },
    [actions.api.guruComFeedSuccess]: (state, action) => {
        return mergeItemsBatchIntoTrail(state, action, config.platforms.guruCom);
    },
    [actions.notificationsBoard.uiToggleFeedRowDetails]: (state, action) => {
        return toggleFeedItemProp(state, action, "hasDetails");
    },
    [actions.notificationsBoard.uiBeepForLastBatch]: (state, action) => {
        return Object.assign({}, state, {shouldBeepForLastBatch: false});
    },
    [actions.notificationsBoard.uiToggleFeedRowVisibility]: (state, action) => {
        return toggleFeedItemProp(state, action, "isVisible");
    },
    [actions.notificationsBoard.uiToggleHiddenFeedRows]: (state, action) => {
        return Object.assign({}, state, {shouldShowHiddenFeedRows: !state.shouldShowHiddenFeedRows});
    }
}, {
    progressing: [],
    shouldBeepForLastBatch: false,
    shouldShowHiddenFeedRows: false,
    items: []
});

export default feedsReducer;