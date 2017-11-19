import React, {Component} from 'react';
import {connect} from "react-redux";
import classNames from "classnames";

import actions from "../../actions"
import config from "../../config";
import newItemNotificationMp3 from "../../assets/mp3/new-item-notification.mp3";
import DocumentTitle from "../../components/DocumentTitle";
import {Box} from "../../components/Box";

import upworkLogo from "../../assets/img/upwork_logo.png";
import guruLogo from "../../assets/img/guru_logo.png";

const newItemNotification = new Audio(newItemNotificationMp3);

class NotificationsBoard extends Component {
    static beepIfNewBatch(props) {
        if (props.shouldBeepForLastBatch) {
            newItemNotification.play();
            props.beepForLastBatch();
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            notificationsRefresherIntervalId: setInterval(this.props.refreshNotifications, config.intervals.notificationsRefresher),
            newItemsTitleBlinkerIntervalId: setInterval(this.newItemsTitleBlinker, config.intervals.newItemsTitleBlinker),
            titlePrefix: "",
        };
    }

    componentDidMount() {
        this.props.refreshNotifications();
    }

    componentWillUnmount() {
        clearInterval(this.state.notificationsRefresherIntervalId);
        clearInterval(this.state.newItemsTitleBlinkerIntervalId);
    }

    componentWillReceiveProps(nextProps) {
        NotificationsBoard.beepIfNewBatch(nextProps);
    }

    render = () => {
        const props = this.props;

        return <div className="container-fluid">
            <DocumentTitle title={`${this.state.titlePrefix}${config.titles.default}`}/>
            <div className="row">
                <div className="col-12">
                    <Box title="All Live Notifications">
                        <button className={classNames({
                            "btn": true,
                            "btn-success": props.shouldShowHiddenFeedRows,
                            "btn-secondary": !props.shouldShowHiddenFeedRows,
                            "active": props.shouldShowHiddenFeedRows
                        })} onClick={props.toggleHiddenFeedRows}>
                            {props.shouldShowHiddenFeedRows ? "Hide hidden items" : "Show hidden items"}
                        </button>
                        <table className="mt-3 table">
                            <thead>
                            <tr>
                                <th>Platform</th>
                                <th>Title</th>
                                <th>From</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {props && props.trail.map((feedItem) => {
                                if (!props.shouldShowHiddenFeedRows && feedItem.isVisible === false) {
                                    return null;
                                }

                                let logo;
                                switch (feedItem.platform) {
                                    case config.platforms.upwork:
                                        logo = upworkLogo;
                                        break;
                                    case config.platforms.guruCom:
                                        logo = guruLogo;
                                        break;
                                    default:
                                        throw new Error("Cannot have a feed item without a platform.");
                                }

                                let row = [<tr key={feedItem.link} className={classNames({"table-info": feedItem.isNew})}
                                               onClick={this.onFeedRowClick(feedItem.guid)}>
                                    <td className={classNames({"border-bottom-0": feedItem.hasDetails})}>
                                        <img className="img-fluid" src={logo} style={{maxWidth: "50px"}} alt={feedItem.platform}/>
                                    </td>
                                    <td className={classNames({"border-bottom-0": feedItem.hasDetails})}>
                                        {feedItem.title}
                                    </td>
                                    <td className={classNames({"border-bottom-0": feedItem.hasDetails})}>
                                        {(new Date(feedItem.pubDate)).toLocaleString('bg-BG')}
                                    </td>
                                    <td className={classNames({"border-bottom-0": feedItem.hasDetails})}>
                                        <button className={classNames({
                                            "btn btn-sm": true,
                                            "btn-outline-warning": feedItem.isVisible,
                                            "btn-outline-success": !feedItem.isVisible
                                        })} onClick={this.onFeedRowHideButtonClick(feedItem.guid)}>
                                            {feedItem.isVisible ? <i className="fa fa-lg fa-times"/> : <i className="fa fa-lg fa-eye"/>}
                                        </button>
                                    </td>
                                </tr>];

                                if (feedItem.hasDetails) {
                                    row.push(<tr className="text-dark" key={feedItem.link + "_expand"}>
                                        <td className="border-0" colSpan="3" dangerouslySetInnerHTML={{__html: feedItem.description}}/>
                                        <td className="border-0">
                                            <a className="btn btn-success" href={feedItem.link} target="_blank"><i className="fa fa-lg fa-external-link"/></a>
                                        </td>
                                    </tr>)
                                }

                                return row;
                            })}
                            </tbody>
                        </table>
                    </Box>
                </div>
            </div>
        </div>;
    };

    onFeedRowClick = guid => {
        return () => (this.props.toggleFeedRowDetails(guid));
    };

    onFeedRowHideButtonClick = guid => {
        return (e) => {
            e.stopPropagation();
            this.props.toggleFeedRowVisibility(guid)
        };
    };

    newItemsTitleBlinker = () => {
        let newItemsCnt = this.props.unseenItems;

        if (newItemsCnt > 0) {
            this.setState({titlePrefix: this.state.titlePrefix ? '' : `(${newItemsCnt}) `});
        }
    };
}

const mapStateToProps = (state, ownProps) => {
    let unseenItems = 0;
    let trail = state.feeds.items;

    trail.forEach(item => {
        if (item.isNew) {
            unseenItems++;
        }
    });

    return {
        unseenItems,
        trail,
        shouldBeepForLastBatch: state.feeds.shouldBeepForLastBatch,
        shouldShowHiddenFeedRows: state.feeds.shouldShowHiddenFeedRows
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        refreshNotifications() {
            dispatch(actions.api.fetchAllFeeds());
        },
        toggleFeedRowDetails(guid) {
            dispatch(actions.notificationsBoard.uiToggleFeedRowDetails(guid));
        },
        toggleFeedRowVisibility(guid) {
            dispatch(actions.notificationsBoard.uiToggleFeedRowVisibility(guid));
        },
        beepForLastBatch() {
            dispatch(actions.notificationsBoard.uiBeepForLastBatch());
        },
        toggleHiddenFeedRows() {
            dispatch(actions.notificationsBoard.uiToggleHiddenFeedRows());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsBoard);