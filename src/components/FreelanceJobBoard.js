import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import classnames from "classnames";

import upworkLogo from "../assets/img/upwork_logo.png";
import guruLogo from "../assets/img/guru_logo.png";
import RefreshIcon from "../icons/RefreshIcon";
import {intervals} from "../config";

import newItemNotificationMp3 from "../assets/mp3/new-item-notification.mp3";
import {Badge, Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

import "../assets/css/animations.css";
import "../assets/css/icons.css";
import FilterIcon from "../icons/FilterIcon";

const newItemNotification = new Audio(newItemNotificationMp3);
const defaultTitle = "Smart Notifier Job Board";

/**
 * Simple jobs board, fetching jobs from upwork and guru.com
 */
@inject("freelanceJobsStore", "appStore")
@observer
class FreelanceJobBoard extends Component {
	constructor(props) {
		super(props);

		//For now UI goes into local state, not yet needed to be in a store.
		this.state = {
			lastBeepGuid: null,
			jobsRefresherId: setInterval(props.freelanceJobsStore.refreshJobs, intervals.jobsRefresher),
			titleBlinkerId: setInterval(this.blinkTitle, intervals.titleBlinker),
			rssStringModalOpen: false,
		};
	}

	componentDidMount() {
		this.props.appStore.changeDocumentTitle(defaultTitle);
		this.props.freelanceJobsStore.refreshJobs();
	}

	componentWillUnmount() {
		clearInterval(this.state.jobsRefresherId);
		clearInterval(this.state.titleBlinkerId);
	}

	componentDidUpdate() {
		const {freelanceJobsStore} = this.props;

		//Check for if incoming feed has new jobs and beep.
		if (freelanceJobsStore.jobs.length > 0 && freelanceJobsStore.jobs[0].guid !== this.state.lastBeepGuid) {
			newItemNotification.play();
			this.setState({lastBeepGuid: freelanceJobsStore.jobs[0].guid});
		}
	}

	render() {
		const {freelanceJobsStore} = this.props;

		return (<React.Fragment>
				<Modal isOpen={this.state.rssStringModalOpen} toggle={this.hideRssStringsModal}>
					<ModalHeader toggle={this.hideRssStringsModal}>Manage your RSS strings</ModalHeader>
					<ModalBody>

					</ModalBody>
					<ModalFooter>
						<Button className="btn-raised" color="primary" onClick={this.hideRssStringsModal}>OK</Button>
					</ModalFooter>
				</Modal>
				<div className="card border-info text-center mt-4">
					<div className="card-header">
						Job Board
					</div>
					<div className="card-body">
						<div className="row">
							<div className="col-12">
								<h5 className="card-title">Auto-reloading list of job ads on Upwork and Guru.</h5>
							</div>
							<div className="col-12">
								<div className="row">
									<div className="col">
										<Button className="btn-raised" color="success" disabled={freelanceJobsStore.fetchingJobs} onClick={freelanceJobsStore.refreshJobs}>
											<RefreshIcon className={classnames({"refresh-icon-anim": freelanceJobsStore.fetchingJobs})} fillColor="white"/>
										</Button>
									</div>
									<div className="col">
										<Button className="btn-raised" color="success" onClick={this.showRssStringsModal}>
											<FilterIcon className="icon" fillColor="white"/>
										</Button>
									</div>
									<div className="col">
										<Button className="btn-raised" color="info" outline={!freelanceJobsStore.showHidden}
												onClick={freelanceJobsStore.toggleShowHidden}>
											Hidden rows are: {freelanceJobsStore.showHidden ? "visible" : "hidden"}. Click to toggle.
										</Button>
									</div>
								</div>
							</div>
							<div className="col-12">
								<div className="table-responsive">
									<table className="table table-dark my-3">
										<thead className="thead-dark">
										<tr>
											<th scope="col">#</th>
											<th scope="col">Platform</th>
											<th scope="col">Title</th>
											<th scope="col">From</th>
											<th scope="col">Actions</th>
										</tr>
										</thead>
										<tbody>
										{freelanceJobsStore.jobs && freelanceJobsStore.jobs.length > 0 && freelanceJobsStore.jobs.map((job, index) => {

											if (!freelanceJobsStore.showHidden && job.visible === false) {
												return null;
											}

											let logo;
											switch (job.platform) {
												case "upwork":
													logo = upworkLogo;
													break;
												case "guru":
													logo = guruLogo;
													break;
												default:
													throw new Error("Cannot have a feed item without a platform.");
											}

											return <React.Fragment key={job.link}>
												<tr onClick={() => {
													freelanceJobsStore.toggleJobDetails(job.guid)
												}}>
													<th scope="row">
														{index + 1}
													</th>
													<td>
														<img className="img-fluid" src={logo} style={{maxWidth: "50px"}} alt={job.platform}/>
													</td>
													<td>
														{job.unread &&
														<Badge color="danger">New</Badge>
														}
														{job.title}
													</td>
													<td>{job.pubDate.toLocaleString('bg-BG')}</td>
													<td>
														<button type="button" className={classnames("btn", {
															"btn-info": !job.visible,
															"btn-outline-info": job.visible
														})}
																onClick={() => {
																	freelanceJobsStore.toggleJobVisibility(job.guid)
																}}>
															{job.visible ? "Hide" : "Show"}
														</button>
													</td>
												</tr>
												{job.showDetails &&
												<tr>
													<td colSpan={2}>
														<a className="btn btn-success" href={job.link} target="_blank">Check on {job.platform}</a>
													</td>
													<td colSpan={3} dangerouslySetInnerHTML={{__html: job.description}}/>
												</tr>
												}
											</React.Fragment>;
										})}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div className="card-footer text-muted">

					</div>
				</div>
			</React.Fragment>
		);
	};

	/**
	 * Blinks the number of unread jobs in the doc title.
	 */
	blinkTitle = () => {
		const {appStore, freelanceJobsStore} = this.props;
		let newJobsCount = freelanceJobsStore.unreadJobsCount;

		if (newJobsCount > 0) {
			if (appStore.documentTitle === defaultTitle) {
				appStore.changeDocumentTitle(`(${newJobsCount}) ${defaultTitle}`);
			} else {
				appStore.changeDocumentTitle(defaultTitle);
			}
		}
	};

	/**
	 * Opens the RSS strings modal. User can enter their RSS strings there in order to filter the results.
	 */
	showRssStringsModal = () => {
		this.setState({rssStringModalOpen: true});
	};

	/**
	 * Opens the RSS strings modal. User can enter their RSS strings there in order to filter the results.
	 */
	hideRssStringsModal = () => {
		this.setState({rssStringModalOpen: false});
	};
}

export default FreelanceJobBoard;