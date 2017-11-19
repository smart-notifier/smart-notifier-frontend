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

const toggleInvoiceItemProp = (state, action, propName) => {
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

const invoiceItemsReducer = handleActions({
    [combineActions(
        actions.api.invoiceItems.indexRequest,
        actions.api.invoiceItems.showRequest,
        actions.api.invoiceItems.storeRequest,
        actions.api.invoiceItems.updateRequest,
        actions.api.invoiceItems.deleteRequest
    )]: (state, action) => {
        return addToProgressing(state, action.type);
    },
    [combineActions(
        actions.api.invoiceItems.deleteFailure,
        actions.api.invoiceItems.indexFailure,
        actions.api.invoiceItems.showFailure,
        actions.api.invoiceItems.storeFailure,
        actions.api.invoiceItems.updateFailure
    )]: (state, action) => {
        return removeFromProgressing(state, action.type.replace("FAILURE", "REQUEST"));
    },
    [actions.api.invoiceItems.indexSuccess]: (state, action) => {
        let newState = removeFromProgressing(state, action.type.replace("SUCCESS", "REQUEST"));
        newState.items = action.payload;
        return newState;
    },
    [combineActions(
        actions.api.invoiceItems.showSuccess,
        actions.api.invoiceItems.storeSuccess,
        actions.api.invoiceItems.updateSuccess
    )]: (state, action) => {
        let newState = removeFromProgressing(state, action.type.replace("SUCCESS", "REQUEST"));
        newState.selectedInvoiceItem = action.payload;
        return newState;
    },
    [actions.api.invoiceItems.deleteSuccess]: (state, action) => {
        let newState = removeFromProgressing(state, actions.api.invoiceItems.deleteRequest);
        newState.items = state.items.filter(item => item.id !== action.payload);
        return newState;
    },
    [actions.invoiceItems.setInvoiceItemToBeDeleted]: (state, action) => {
        return Object.assign({}, state, {invoiceItemToBeDeleted: action.payload});
    },
}, {
    progressing: [],
    invoiceItemToBeDeleted: null,
    selectedInvoiceItem: {},
    items: []
});

export default invoiceItemsReducer;