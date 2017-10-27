import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, createStore} from "redux";
import {Provider} from "react-redux";
import createHistory from 'history/createBrowserHistory';
import {ConnectedRouter, routerMiddleware} from 'react-router-redux';
import thunk from "redux-thunk";
import ApiMiddleware from "./middleware/api";
// import Invalidate from "./middleware/invalidate";
import reducers from "./reducers";

import './assets/css/style.default.css';
import './assets/css/style.css';

import config from "./config";
import NotificationsBoard from "./pages/boards/NotificationsBoard";
import DefaultLayout from "./layouts/DefaultLayout";
import {Redirect, Route} from "react-router-dom";
import {Switch} from "react-router-dom";

const history = createHistory();
const middlewares = [thunk, ApiMiddleware, routerMiddleware(history)];

let store = createStore(
    reducers,
    applyMiddleware(...middlewares)
);
//Template Url: http://demo.bootstrapious.com/admin/index.html
ReactDOM.render(<Provider store={store}>
    <ConnectedRouter history={history}>
        <DefaultLayout>
            <Switch>
                <Redirect exact from={config.paths.root} to={config.paths.notificationsBoard}/>
                <Route path={config.paths.notificationsBoard} component={NotificationsBoard}/>
            </Switch>
        </DefaultLayout>
    </ConnectedRouter>
</Provider>, document.getElementById('root'));