import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {reducer as formReducer} from 'redux-form'
import feeds from "./feedsReducer";
import invoices from "./invoicesReducer";
import invoiceItems from "./invoiceItemsReducer";
import recipients from "./recipientsReducer";

export default combineReducers({
    feeds,
    invoices,
    recipients,
    invoiceItems,
    router: routerReducer,
    form: formReducer
});