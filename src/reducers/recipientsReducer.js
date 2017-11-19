import {combineActions, handleActions} from "redux-actions";
import actions from "../actions";
import {findIndex} from "lodash/array";

const addToProgressing = (state, req) => {
    let progressing = [...state.progressing];
    progressing.push(req.type);
    return Object.assign({}, state, {progressing});
};

const removeFromProgressing = (state, req) => {
    let progressing = state.progressing.filter(item => item !== req.type);
    return Object.assign({}, state, {progressing});
};

const toggleRecipientProp = (state, action, propName) => {
    let toggledItemId = action.payload;
    let allItems = state.items;

    let toggledItemIndex = findIndex(allItems, ['id', toggledItemId]);
    let toggledItem = allItems[toggledItemIndex];

    let newItem = {...toggledItem};
    newItem[propName] = !toggledItem[propName];

    let newTrail = [...allItems];
    newTrail[toggledItemIndex] = newItem;

    return Object.assign({}, state, {items: newTrail});
};

const recipientsReducer = handleActions({
    [combineActions(
        actions.api.recipients.indexRequest,
        actions.api.recipients.showRequest,
        actions.api.recipients.storeRequest,
        actions.api.recipients.updateRequest,
        actions.api.recipients.deleteRequest
    )]: (state, action) => {
        return addToProgressing(state, action.type);
    },
    [combineActions(
        actions.api.recipients.deleteFailure,
        actions.api.recipients.indexFailure,
        actions.api.recipients.showFailure,
        actions.api.recipients.storeFailure,
        actions.api.recipients.updateFailure
    )]: (state, action) => {
        return removeFromProgressing(state, action.type.replace("FAILURE", "REQUEST"));
    },
    [actions.api.recipients.indexSuccess]: (state, action) => {
        let newState = removeFromProgressing(state, action.type.replace("SUCCESS", "REQUEST"));
        newState.items = action.payload;
        return newState;
    },
    [combineActions(
        actions.api.recipients.showSuccess,
        actions.api.recipients.storeSuccess,
        actions.api.recipients.updateSuccess
    )]: (state, action) => {
        let newState = removeFromProgressing(state, action.type.replace("SUCCESS", "REQUEST"));
        newState.selectedRecipient = action.payload;
        return newState;
    },
    [actions.api.recipients.deleteSuccess]: (state, action) => {
        let newState = removeFromProgressing(state, actions.api.recipients.deleteRequest);
        newState.items = state.items.filter(item => item.id !== action.payload);
        return newState;
    },
    [actions.recipients.setRecipientToBeDeleted]: (state, action) => {
        return Object.assign({}, state, {recipientToBeDeleted: action.payload});
    },
}, {
    progressing: [],
    recipientToBeDeleted: null,
    selectedRecipient: {},
    items: []
});

export default recipientsReducer;