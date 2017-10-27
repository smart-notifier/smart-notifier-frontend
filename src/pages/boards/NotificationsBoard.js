import React, {Component} from 'react';
import {connect} from "react-redux";

import {refreshNotifications} from "../../actions"
import config from "../../config";
import {uiNotificationsBoardToggleExpandUpworkFeedRow} from "../../actions/index";

class NotificationsBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notificationsRefresherIntervalId: -1,
        };
    }

    componentDidMount() {
        this.props.refreshNotifications();
        let notificationsRefresherIntervalId = setInterval(this.props.refreshNotifications, config.intervals.notificationsRefresher);
        this.setState({notificationsRefresherIntervalId});
    }

    componentWillUnmount() {
        clearInterval(this.state.notificationsRefresherIntervalId);
    }

    render = () => {
        const props = this.props;
        return <div className="row">
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
                                    <table className="mt-3 table table-dark table-hover table-responsive ">
                                        <thead className="thead-dark">
                                        <tr>
                                            <th>Title</th>
                                            <th>From</th>
                                            <th>Link</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {props && props.upworkCurrent.map((feedItem, index) => {
                                            let row = [<tr key={feedItem.link} className={feedItem.isNew ? "bg-primary" : ""} onClick={this.onUpworkRowClick(index)}>
                                                <td>
                                                    {feedItem.title}
                                                </td>
                                                <td>
                                                    {(new Date(feedItem.publishedOn)).toLocaleString('bg-BG')}
                                                </td>
                                                <td rowSpan={feedItem.expanded ? 2 : 1}>
                                                    <a href={feedItem.link} title={feedItem.title} target="_blank">go to upwork</a>
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

    onUpworkRowClick = index => {
        return () => (this.props.toggleUpworkFeedRow(index));
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        upworkCurrent: state.feeds.upwork.current,
        upworkPrevious: state.feeds.upwork.previous,
        upworkDiff: state.feeds.upwork.diff,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        refreshNotifications() {
            dispatch(refreshNotifications());
        },
        toggleUpworkFeedRow(index) {
            dispatch(uiNotificationsBoardToggleExpandUpworkFeedRow(index));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsBoard);