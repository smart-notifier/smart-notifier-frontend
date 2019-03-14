import {action, computed, observable, runInAction} from "mobx";
import * as axios from "axios";
import {each, orderBy} from "lodash/collection";
import {differenceBy} from "lodash/array";
import {sizes} from "../config";
import {isEmpty} from "lodash/lang";
import {appStore} from "../stores/AppStore";
import localforage from "localforage";

const hydrateJob = (job, platform) => {
	job.pubDate = new Date(job.pubDate);
	job.platform = platform;
	job.unread = true;
	job.details = false;
	job.visible = true;
};

/**
 * MobX store for all the jobs loaded from RSS.
 * @author nikolai.tenev@digidworks.com
 */
class FreelanceJobsStore {
	@observable
	showHidden;

	@observable
	jobs;

	@observable
	fetchingJobs;

	@observable
	rssStrings;

	constructor() {
		this.showHidden = false;
		this.jobs = [];
	}

	@computed
	get unreadJobsCount() {
		return this.jobs.reduce((acc, job) => (job.unread ? ++acc : acc), 0);
	};

	hydrate = async () => {
		const rssStrings = await localforage.getItem("rssStrings");

		runInAction(() => {
			this.rssStrings = rssStrings;
		});
	};

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
			if (isEmpty(this.rssStrings)) {
				throw new Error("You haven't entered RSS queries.");
			}

			const rssRequests = new Map();

			each(this.rssStrings, (val, key) => {
				rssRequests.set(key, axios.get(`${process.env.REACT_APP_API_URL}feeds/rss/${key}/${val}`));
			});

			const resolvedRssRequests = await Promise.all(rssRequests.values());
			const platforms = Array.from(rssRequests.keys());

			let allNewJobsCount = 0;
			const preparedAllNewJobs = [];
			resolvedRssRequests.forEach((job, index) => {
				if (job.status >= 300) {
					throw new Error(job.statusText);
				}

				const filteredJobs = differenceBy(job.data, this.jobs, "guid");
				filteredJobs.forEach((job) => (hydrateJob(job, platforms[index])));

				preparedAllNewJobs.push(...filteredJobs);
				allNewJobsCount += filteredJobs.length;
			});

			newJobs = orderBy([...preparedAllNewJobs, ...this.jobs.slice(0, sizes.jobsList - allNewJobsCount)], ["pubDate", "guid"], ["desc"]);
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

	@action
	setRssStrings({upwork, guru}) {
		const rssStrings = {upwork, guru};
		this.rssStrings = rssStrings;
		localforage.setItem("rssStrings", rssStrings);
	}
}

const freelanceJobsStore = new FreelanceJobsStore();
freelanceJobsStore.hydrate();

export {freelanceJobsStore}
