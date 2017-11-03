import React, {Component} from 'react';
import {connect} from "react-redux";

import actions from "../../actions"
import config from "../../config";
import newItemNotificationMp3 from "../../assets/mp3/new-item-notification.mp3";
import DocumentTitle from "../../components/DocumentTitle";

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

        return <div className="row">
            <DocumentTitle title={`${this.state.titlePrefix}${config.defaultTitle}`}/>
            <div className="col">
                <header className="page-header">
                    <div className="container-fluid">
                        <h2 className="no-margin-bottom">All Live Notifications</h2>
                    </div>
                </header>
                <section>
                    <div className="container-fluid">
                        <div className="row has-shadow">
                            <div className="col">
                                <div className="d-flex align-items-center">
                                    <table className="mt-3 table table-dark table-hover">
                                        <thead className="thead-dark">
                                        <tr>
                                            <th>Title</th>
                                            <th>From</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {props && props.upworkTrail.map((feedItem) => {
                                            if (feedItem.isHidden) {
                                                return null;
                                            }
                                            let row = [<tr key={feedItem.link} className={feedItem.isNew ? "bg-primary" : ""} onClick={this.onUpworkRowClick(feedItem.title)}>
                                                <td>
                                                    {feedItem.title}
                                                </td>
                                                <td>
                                                    {(new Date(feedItem.publishedOn)).toLocaleString('bg-BG')}
                                                </td>
                                            </tr>];

                                            if (feedItem.expanded) {
                                                row.push(<tr className="bg-gray text-dark" key={feedItem.link + "_expand"}>
                                                    <td colSpan="3" dangerouslySetInnerHTML={{__html: feedItem.description}}/>
                                                </tr>)
                                            }

                                            return row;
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>;
    };

    onUpworkRowClick = title => {
        return () => (this.props.toggleUpworkFeedRow(title));
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
    let upworkTrail = state.feeds.upwork.items;

    upworkTrail.forEach(item => {
        if (item.isNew) {
            unseenItems++;
        }
    });

    return {
        unseenItems,
        upworkTrail,
        shouldBeepForLastBatch: state.feeds.shouldBeepForLastBatch,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        refreshNotifications() {
            dispatch(actions.api.fetchUpworkFeed());
        },
        toggleUpworkFeedRow(title) {
            dispatch(actions.notificationsBoard.uiToggleExpandUpworkFeedRow(title));
        },
        beepForLastBatch() {
            dispatch(actions.notificationsBoard.uiBeepForLastBatch());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsBoard);