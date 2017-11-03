import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, createStore} from "redux";
import {Provider} from "react-redux";
import createHistory from 'history/createBrowserHistory';
import {ConnectedRouter, routerMiddleware} from 'react-router-redux';
import {Redirect, Route, Switch} from "react-router-dom";
import thunk from "redux-thunk";
import localForage from "localforage";

import config from "./config";
import ApiMiddleware from "./middleware/api";
import reducers from "./reducers";
import DefaultLayout from "./layouts/DefaultLayout";
import NotificationsBoard from "./pages/boards/NotificationsBoard";

import './assets/css/style.default.css';
import './assets/css/style.css';
import {isNil} from "lodash/lang";

localForage.config({
    name: "Smart Notifier App",
    storeName: "smart-notifier-app-store",
    description: "Smart Notifier App Storage"
});

localForage.getItem("state", (err, result) => {//cuz only real PROs use async when it's totally unneeded, without giving you the option to do sync.... right mozilla?!?!
    let persistedState = undefined;

    if (!err) {
        if (!isNil(result)) {
            persistedState = JSON.parse(result);
            persistedState.feeds.progressing = [];
        }
    } else {
        console.error(err);
    }


    const history = createHistory();
    const middlewares = [thunk, ApiMiddleware, routerMiddleware(history)];

    let store = createStore(
        reducers,
        persistedState,
        applyMiddleware(...middlewares)
    );

    store.subscribe(() => {
        const state = {
            feeds: {
                shouldBeepForLastBatch: store.getState().feeds.shouldBeepForLastBatch,
                upwork: {
                    items: store.getState().feeds.upwork.items
                }
            }
        };

        const serializedState = JSON.stringify(state);
        localForage.setItem("state", serializedState);
    });

    //Template Url: http://demo.bootstrapious.com/admin/index.html
    //MP3 notif URL: https://appraw.com/ringtone/cool-notification-2-qjmxk they say it's free
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
});