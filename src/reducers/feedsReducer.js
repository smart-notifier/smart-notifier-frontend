import {handleActions} from "redux-actions";
import actions from "../actions";
import {concat, differenceBy, findIndex, take} from "lodash/array";

import config from "../config";

const feedsReducer = handleActions({
    [actions.api.upworkFeedRequest]: (state, action) => {
        let progressing = [...state.progressing];
        progressing.push(actions.api.upworkFeedRequest.type);

        return Object.assign({}, state, {progressing});
    },
    [actions.api.upworkFeedSuccess]: (state, action) => {
        let progressing = state.progressing.filter(item => item !== actions.api.upworkFeedRequest.type);

        let currentTrail = state.upwork.items;
        let newItemsBatchArray = action.payload;
        let maxTrailSize = config.feeds.maxTrailSize;

        let newItems = differenceBy(newItemsBatchArray, currentTrail, "title");
        newItems.forEach(item => {
            item.isNew = true;
            item.expanded = false;
            item.isVisible = true;
        });

        let newTrail = take(concat(newItems, currentTrail), maxTrailSize);

        let shouldBeepForLastBatch = newItems.length > 0;
        return Object.assign({}, state, {
            progressing,
            shouldBeepForLastBatch,
            upwork: {
                items: newTrail
            }
        });
    },

    [actions.api.upworkFeedFailure]: (state, action) => {
        let progressing = state.progressing.filter(item => item !== actions.api.upworkFeedRequest.type);

        return Object.assign({}, state, {progressing});
    },

    [actions.notificationsBoard.uiToggleExpandUpworkFeedRow]: (state, action) => {
        let toggledItemTitle = action.payload;
        let currentTrail = state.upwork.items;

        let toggledItemIndex = findIndex(currentTrail, ['title', toggledItemTitle]);
        let toggledItem = currentTrail[toggledItemIndex];

        let newItem = Object.assign({}, toggledItem, {expanded: !toggledItem.expanded, isNew: false});
        let newTrail = [...currentTrail];
        newTrail[toggledItemIndex] = newItem;


        return Object.assign({}, state, {upwork: {items: newTrail}});
    },
    [actions.notificationsBoard.uiBeepForLastBatch]: (state, action) => {
        return Object.assign({}, state, {shouldBeepForLastBatch: false});
    },
    [actions.notificationsBoard.uiToggleVisibilityItemFromFeedTable]: (state, action) => {
        let toggledItemTitle = action.payload;
        let currentTrail = state.upwork.items;

        let toggledItemIndex = findIndex(currentTrail, ['title', toggledItemTitle]);
        let toggledItem = currentTrail[toggledItemIndex];

        let newItem = Object.assign({}, toggledItem, {isVisible: !toggledItem.isVisible, isNew: false});
        let newTrail = [...currentTrail];
        newTrail[toggledItemIndex] = newItem;


        return Object.assign({}, state, {upwork: {items: newTrail}});
    }
}, {
    progressing: [],
    shouldBeepForLastBatch: false,
    upwork: {
        items: []
    }
});

export default feedsReducer;