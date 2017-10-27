import React, {Component} from 'react';
import {connect} from "react-redux";

import config from "../config";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";

class DefaultLayout extends Component {
    render() {
        const props = this.props;
        return [
            <div key="header-navigation" className="d-flex flex-column">
                <header className="header">
                    <nav className="navbar">
                        <div className="container-fluid">
                            <div className="navbar-holder d-flex align-items-center justify-content-between">
                                <div className="navbar-header">
                                    <Link to={config.paths.root} className="navbar-brand">
                                        <div className="brand-text brand-big d-none d-lg-block"><span>Smart </span><strong>Notifier</strong></div>
                                        <div className="brand-text d-block d-lg-none"><strong>SN</strong></div>
                                    </Link>
                                    <button className="btn-link menu-btn active"><span/><span/><span/></button>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>
            </div>,
            <div key="content" className="h-100 page-content d-flex align-items-stretch">
                <nav className="side-navbar pt-3">
                    <span className="heading">Main</span>
                    <ul className="list-unstyled">
                        <li className="active">
                            <Link to={config.paths.root}>
                                <i className="icon-home"/>Home
                            </Link>
                        </li>
                        <li>
                            <Link to={config.paths.notificationsBoard}>
                                <i className="icon-grid"/>Notifications Board
                            </Link>
                        </li>
                        <li>
                            <Link to={config.paths.notificationsBoard}>
                                <i className="icon-grid"/>Settings
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="content-inner">
                    {props.children}
                    <footer className="main-footer">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-6">
                                    <p>© {new Date().getFullYear()} Smart Notifier</p>
                                </div>
                                <div className="col-sm-6 text-right">
                                    <p>Developed by <a href="https://digidworks.com/en" className="external">DigidWorks</a></p>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>];
    }
}

const mapStateToProps = (state, ownProps) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {}
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DefaultLayout));
