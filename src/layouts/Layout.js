import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import DocumentTitle from "react-helmet";
import {Alert} from "reactstrap";

import "../assets/css/global.css";
import {intervals} from "../config";

@inject("appStore")
@observer
class Layout extends Component {
	render() {
		const {appStore} = this.props;
		return (
			<React.Fragment>
				<DocumentTitle title={appStore.documentTitle}/>
				{appStore.errors && appStore.errors.length > 0 &&
				<div className="global-alert mt-3">
					{appStore.errors.map((error, index) => (
						<Alert key={index} color="danger" isOpen={error.visible} toggle={() => {
							appStore.hideError(index);
							let clearMe = setTimeout(() => {
								appStore.removeError(index);
								clearTimeout(clearMe);
							}, intervals.waitBeforeDeletingErrorAlert);
						}}>
							{error.message}
						</Alert>
					))}
				</div>
				}
				<div className="container">
					<div className="row">
						<div className="col">
							{this.props.children}
						</div>
					</div>
					<footer className="row">
						<div className="col">
							<p>© {new Date().getFullYear()} Smart Notifier</p>
						</div>
						<div className="col text-right">
							<p>Developed by <a href="https://digidworks.com/" className="external">DigidWorks</a></p>
						</div>
					</footer>
				</div>
			</React.Fragment>
		);
	};
}

export default Layout;