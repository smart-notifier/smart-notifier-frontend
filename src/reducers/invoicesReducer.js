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

const toggleInvoiceProp = (state, action, propName) => {
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

const invoicesReducer = handleActions({
    [combineActions(
        actions.api.invoices.indexRequest,
        actions.api.invoices.showRequest,
        actions.api.invoices.storeRequest,
        actions.api.invoices.updateRequest,
        actions.api.invoices.deleteRequest
    )]: (state, action) => {
        return addToProgressing(state, action.type);
    },
    [combineActions(
        actions.api.invoices.deleteFailure,
        actions.api.invoices.indexFailure,
        actions.api.invoices.showFailure,
        actions.api.invoices.storeFailure,
        actions.api.invoices.updateFailure
    )]: (state, action) => {
        return removeFromProgressing(state, action.type.replace("FAILURE", "REQUEST"));
    },
    [actions.api.invoices.indexSuccess]: (state, action) => {
        let newState = removeFromProgressing(state, action.type.replace("SUCCESS", "REQUEST"));
        newState.items = action.payload;
        return newState;
    },
    [combineActions(
        actions.api.invoices.showSuccess,
        actions.api.invoices.storeSuccess,
        actions.api.invoices.updateSuccess
    )]: (state, action) => {
        let newState = removeFromProgressing(state, action.type.replace("SUCCESS", "REQUEST"));
        newState.selectedInvoice = action.payload;
        return newState;
    },
    [actions.api.invoices.deleteSuccess]: (state, action) => {
        let newState = removeFromProgressing(state, actions.api.invoices.deleteRequest);
        newState.items = state.items.filter(item => item.id !== action.payload);
        return newState;
    },
    [actions.invoices.uiToggleInvoiceRowDetails]: (state, action) => {
        return toggleInvoiceProp(state, action, "hasDetails");
    },
    [actions.invoices.setInvoiceToBeDeleted]: (state, action) => {
        return Object.assign({}, state, {invoiceToBeDeleted: action.payload});
    },
}, {
    progressing: [],
    invoiceToBeDeleted: null,
    selectedInvoice: {},
    items: []
});

export default invoicesReducer;