import {action, computed, observable, runInAction} from "mobx";
import * as axios from "axios";
import {orderBy} from "lodash/collection";
import {differenceBy} from "lodash/array";
import {sizes} from "../config";
import {appStore} from "./AppStore";

class FreelanceJobsStore {
	@observable
	showHidden;

	@observable
	jobs;

	@observable
	fetchingJobs;

	constructor() {
		this.showHidden = false;
		this.jobs = [];
	}

	@action
	toggleShowHidden = () => {
		this.showHidden = !this.showHidden;
	};

	@action
	toggleJobDetails = (jobId) => {
		this.jobs.forEach((job) => {
			if (job.guid === jobId) {
				job.showDetails = !job.showDetails;
				job.unread = false;
			}
		});
	};

	@action
	toggleJobVisibility = (jobId) => {
		this.jobs.forEach((job) => {
			if (job.guid === jobId) {
				job.visible = !job.visible;
			}
		});
	};

	@action
	refreshJobs = async () => {
		this.fetchingJobs = true;
		let newJobs;

		try {
			const [jobsUpwork, jobsGuru] = await Promise.all([
				axios.get(`${process.env.REACT_APP_API_URL}feeds/rss/${process.env.REACT_APP_UPWORK_RSS_PARAMS}`),
				axios.get(`${process.env.REACT_APP_API_URL}feeds/rss/${process.env.REACT_APP_GURU_RSS_PARAMS}`)
			]);

			if (jobsUpwork.status >= 300) {
				throw new Error(jobsUpwork.statusText);
			}

			if (jobsGuru.status >= 300) {
				throw new Error(jobsGuru.statusText);
			}

			const newJobsUpwork = differenceBy(jobsUpwork.data, this.jobs, "guid");
			const newJobsGuru = differenceBy(jobsGuru.data, this.jobs, "guid");

			newJobsUpwork.forEach((job) => (this.hydrateJob(job, "upwork")));
			newJobsGuru.forEach((job) => (this.hydrateJob(job, "guru")));

			newJobs = orderBy([...newJobsUpwork, ...newJobsGuru, ...this.jobs.slice(0, sizes.jobsList - newJobsGuru.length - newJobsUpwork.length)], ["pubDate", "guid"], ["desc"]);
		} catch (e) {
			console.log(e);
			appStore.addError(e.message);
		} finally {
			runInAction(() => {
				if (newJobs) {
					this.jobs = newJobs;
				}
				this.fetchingJobs = false;
			});
		}
	};

	hydrateJob = (job, platform) => {
		job.pubDate = new Date(job.pubDate);
		job.platform = platform;
		job.unread = true;
		job.details = false;
		job.visible = true;
	};

	@computed
	get unreadJobsCount() {
		return this.jobs.reduce((acc, job) => (job.unread ? ++acc : acc), 0);
	};
}

export const freelanceJobsStore = new FreelanceJobsStore();