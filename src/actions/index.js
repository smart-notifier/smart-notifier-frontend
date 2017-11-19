import {createActions} from "redux-actions";

import {CALL_API_KEY, CREATE_METHOD, DELETE_METHOD, UPDATE_METHOD} from "../middleware/api";
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
        UPWORK_FEED_FAILURE: undefined,
        GURU_COM_FEED_REQUEST: undefined,
        GURU_COM_FEED_SUCCESS: undefined,
        GURU_COM_FEED_FAILURE: undefined,
        INVOICES: {
            INDEX_REQUEST: undefined,
            INDEX_SUCCESS: undefined,
            INDEX_FAILURE: undefined,
            SHOW_REQUEST: undefined,
            SHOW_SUCCESS: undefined,
            SHOW_FAILURE: undefined,
            STORE_REQUEST: undefined,
            STORE_SUCCESS: undefined,
            STORE_FAILURE: undefined,
            UPDATE_REQUEST: undefined,
            UPDATE_SUCCESS: undefined,
            UPDATE_FAILURE: undefined,
            DELETE_REQUEST: undefined,
            DELETE_SUCCESS: undefined,
            DELETE_FAILURE: undefined,
        },
        RECIPIENTS: {
            INDEX_REQUEST: undefined,
            INDEX_SUCCESS: undefined,
            INDEX_FAILURE: undefined,
            SHOW_REQUEST: undefined,
            SHOW_SUCCESS: undefined,
            SHOW_FAILURE: undefined,
            STORE_REQUEST: undefined,
            STORE_SUCCESS: undefined,
            STORE_FAILURE: undefined,
            UPDATE_REQUEST: undefined,
            UPDATE_SUCCESS: undefined,
            UPDATE_FAILURE: undefined,
            DELETE_REQUEST: undefined,
            DELETE_SUCCESS: undefined,
            DELETE_FAILURE: undefined,
        },
        INVOICE_ITEMS: {
            INDEX_REQUEST: undefined,
            INDEX_SUCCESS: undefined,
            INDEX_FAILURE: undefined,
            SHOW_REQUEST: undefined,
            SHOW_SUCCESS: undefined,
            SHOW_FAILURE: undefined,
            STORE_REQUEST: undefined,
            STORE_SUCCESS: undefined,
            STORE_FAILURE: undefined,
            UPDATE_REQUEST: undefined,
            UPDATE_SUCCESS: undefined,
            UPDATE_FAILURE: undefined,
            DELETE_REQUEST: undefined,
            DELETE_SUCCESS: undefined,
            DELETE_FAILURE: undefined,
        }
    },
});

const simpleApiActionCreators = createActions({
    API: {
        FETCH_UPWORK_FEED: createApiAction(simpleApiActions.api.upworkFeedRequest, simpleApiActions.api.upworkFeedSuccess, simpleApiActions.api.upworkFeedFailure, config.apiRoutes.feeds.rss + config.feeds.requestOptions.upwork),
        FETCH_GURU_COM_FEED: createApiAction(simpleApiActions.api.guruComFeedRequest, simpleApiActions.api.guruComFeedSuccess, simpleApiActions.api.guruComFeedFailure, config.apiRoutes.feeds.rss + config.feeds.requestOptions.guruCom),
        INVOICES: {
            INDEX: createApiAction(simpleApiActions.api.invoices.indexRequest, simpleApiActions.api.invoices.indexSuccess, simpleApiActions.api.invoices.indexFailure, config.apiRoutes.invoices.index),
            SHOW: (invoiceId) => ({
                [CALL_API_KEY]: {
                    types: [simpleApiActions.api.invoices.showRequest, simpleApiActions.api.invoices.showSuccess, simpleApiActions.api.invoices.showFailure],
                    path: config.apiRoutes.invoices.show.replace("{id}", invoiceId)
                }
            }),
            STORE: (invoice) => ({
                [CALL_API_KEY]: {
                    types: [simpleApiActions.api.invoices.storeRequest, simpleApiActions.api.invoices.storeSuccess, simpleApiActions.api.invoices.storeFailure],
                    path: config.apiRoutes.invoices.store,
                    method: CREATE_METHOD,
                    body: invoice
                }
            }),
            UPDATE: (invoice) => ({
                [CALL_API_KEY]: {
                    types: [simpleApiActions.api.invoices.updateRequest, simpleApiActions.api.invoices.updateSuccess, simpleApiActions.api.invoices.updateFailure],
                    path: config.apiRoutes.invoices.update.replace("{id}", invoice.id),
                    method: UPDATE_METHOD,
                    body: invoice
                }
            }),
            DELETE: (invoiceId) => ({
                [CALL_API_KEY]: {
                    types: [simpleApiActions.api.invoices.deleteRequest, simpleApiActions.api.invoices.deleteSuccess, simpleApiActions.api.invoices.deleteFailure],
                    path: config.apiRoutes.invoices.delete.replace("{id}", invoiceId),
                    method: DELETE_METHOD
                }
            }),
        },
        RECIPIENTS: {
            INDEX: createApiAction(simpleApiActions.api.recipients.indexRequest, simpleApiActions.api.recipients.indexSuccess, simpleApiActions.api.recipients.indexFailure, config.apiRoutes.recipients.index),
            SHOW: (invoiceId) => ({
                [CALL_API_KEY]: {
                    types: [simpleApiActions.api.recipients.showRequest, simpleApiActions.api.recipients.showSuccess, simpleApiActions.api.recipients.showFailure],
                    path: config.apiRoutes.recipients.show.replace("{id}", invoiceId)
                }
            }),
            STORE: (invoice) => ({
                [CALL_API_KEY]: {
                    types: [simpleApiActions.api.recipients.storeRequest, simpleApiActions.api.recipients.storeSuccess, simpleApiActions.api.recipients.storeFailure],
                    path: config.apiRoutes.recipients.store,
                    method: CREATE_METHOD,
                    body: invoice
                }
            }),
            UPDATE: (invoice) => ({
                [CALL_API_KEY]: {
                    types: [simpleApiActions.api.recipients.updateRequest, simpleApiActions.api.recipients.updateSuccess, simpleApiActions.api.recipients.updateFailure],
                    path: config.apiRoutes.recipients.update.replace("{id}", invoice.id),
                    method: UPDATE_METHOD,
                    body: invoice
                }
            }),
            DELETE: (invoiceId) => ({
                [CALL_API_KEY]: {
                    types: [simpleApiActions.api.recipients.deleteRequest, simpleApiActions.api.recipients.deleteSuccess, simpleApiActions.api.recipients.deleteFailure],
                    path: config.apiRoutes.recipients.delete.replace("{id}", invoiceId),
                    method: DELETE_METHOD
                }
            }),
        },
        INVOICE_ITEMS: {
            INDEX: createApiAction(simpleApiActions.api.invoiceItems.indexRequest, simpleApiActions.api.invoiceItems.indexSuccess, simpleApiActions.api.invoiceItems.indexFailure, config.apiRoutes.invoiceItems.index),
            SHOW: (invoiceId) => ({
                [CALL_API_KEY]: {
                    types: [simpleApiActions.api.invoiceItems.showRequest, simpleApiActions.api.invoiceItems.showSuccess, simpleApiActions.api.invoiceItems.showFailure],
                    path: config.apiRoutes.invoiceItems.show.replace("{id}", invoiceId)
                }
            }),
            STORE: (invoice) => ({
                [CALL_API_KEY]: {
                    types: [simpleApiActions.api.invoiceItems.storeRequest, simpleApiActions.api.invoiceItems.storeSuccess, simpleApiActions.api.invoiceItems.storeFailure],
                    path: config.apiRoutes.invoiceItems.store,
                    method: CREATE_METHOD,
                    body: invoice
                }
            }),
            UPDATE: (invoice) => ({
                [CALL_API_KEY]: {
                    types: [simpleApiActions.api.invoiceItems.updateRequest, simpleApiActions.api.invoiceItems.updateSuccess, simpleApiActions.api.invoiceItems.updateFailure],
                    path: config.apiRoutes.invoiceItems.update.replace("{id}", invoice.id),
                    method: UPDATE_METHOD,
                    body: invoice
                }
            }),
            DELETE: (invoiceId) => ({
                [CALL_API_KEY]: {
                    types: [simpleApiActions.api.invoiceItems.deleteRequest, simpleApiActions.api.invoiceItems.deleteSuccess, simpleApiActions.api.invoiceItems.deleteFailure],
                    path: config.apiRoutes.invoiceItems.delete.replace("{id}", invoiceId),
                    method: DELETE_METHOD
                }
            }),
        }
    }
});


const actionCreators = createActions({
    BASIC: {
        REFETCH_DATA: undefined,
    },
    API: {
        FETCH_ALL_FEEDS: () => (dispatch, getState) => {
            dispatch(simpleApiActionCreators.api.fetchUpworkFeed());
            dispatch(simpleApiActionCreators.api.fetchGuruComFeed());
        }
    },
    NOTIFICATIONS_BOARD: {
        UI_TOGGLE_FEED_ROW_VISIBILITY: undefined,
        UI_TOGGLE_FEED_ROW_DETAILS: undefined,
        UI_BEEP_FOR_LAST_BATCH: undefined,
        UI_TOGGLE_HIDDEN_FEED_ROWS: undefined,
    },
    INVOICES: {
        SET_INVOICE_TO_BE_DELETED: undefined,
        UI_TOGGLE_INVOICE_ROW_DETAILS: undefined
    },
    INVOICE_ITEMS: {
        SET_INVOICE_ITEM_TO_BE_DELETED: undefined
    },
    RECIPIENTS: {
        SET_RECIPIENT_TO_BE_DELETED: undefined
    }
});

export default merge(actionCreators, simpleApiActionCreators, simpleApiActions);