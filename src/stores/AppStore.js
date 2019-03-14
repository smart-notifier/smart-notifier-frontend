import {action, observable} from "mobx";

/**
 * Contains app-related logic only.
 * @author nikolai.tenev@digidworks.com
 */
class AppStore {
	@observable
	documentTitle;

	@observable
	errors;

	@observable
	modals;

	constructor() {
		this.errors = [];
	}

	@action
	changeDocumentTitle = (newTitle) => {
		this.documentTitle = newTitle;
	};

	@action
	addError = (message) => {
		this.errors.push({visible: true, message});
	};

	@action
	hideError = (index) => {
		this.errors[index].visible = false;
	};

	@action
	removeError = (index) => {
		this.errors.splice(index, 1);
	};
}

export const appStore = new AppStore();
