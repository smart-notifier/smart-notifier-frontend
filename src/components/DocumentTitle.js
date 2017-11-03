import {Children, Component} from 'react';
import PropTypes from 'prop-types';
import withSideEffect from 'react-side-effect';

class DocumentTitle extends Component {
    render() {
        if (this.props.children) {
            return Children.only(this.props.children);
        } else {
            return null;
        }
    }
}

DocumentTitle.propTypes = {
    title: PropTypes.string.isRequired
};

function reducePropsToState(propsList) {
    let innermostProps = propsList[propsList.length - 1];
    if (innermostProps) {
        return innermostProps.title;
    }
}

function handleStateChangeOnClient(title) {
    window.document.title = title || '';
}

export default withSideEffect(
    reducePropsToState,
    handleStateChangeOnClient
)(DocumentTitle);