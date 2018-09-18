import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Layout from "./layouts/Layout";
import FreelanceJobBoard from "./components/FreelanceJobBoard";
import {Provider} from "mobx-react";
import {configure} from "mobx";
import {appStore} from "./stores/AppStore";
import {freelanceJobsStore} from "./stores/FreelanceJobsStore";
import localForage from "localforage";
// import './index.css';

configure({enforceActions: "always"});
localForage.config({
	name:"Smart Notifier",
	storeName:"smart_notifier_offline_store"
});

ReactDOM.render(
	<Provider appStore={appStore} freelanceJobsStore={freelanceJobsStore}>
		<Layout>
			<FreelanceJobBoard/>
		</Layout>
	</Provider>, document.getElementById('root'));

registerServiceWorker();
