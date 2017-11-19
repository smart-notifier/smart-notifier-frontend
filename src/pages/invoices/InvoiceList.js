import React, {Component} from 'react';
import {connect} from "react-redux";
import classNames from "classnames";

import actions from "../../actions"
import config from "../../config";
import DocumentTitle from "../../components/DocumentTitle";
import {Box} from "../../components/Box";
import {Link} from "react-router-dom";
import {reduce} from "lodash";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

class InvoiceList extends Component {
    constructor(props) {
        super(props);

        props.loadInvoices();
    }

    render = () => {
        const props = this.props;

        return <div className="container-fluid">
            <DocumentTitle title={config.titles.invoices.list}/>
            {props.invoiceToBeDeleted && <Modal isOpen={props.invoiceToBeDeleted} toggle={props.unsetInvoiceToBeDeleted}>
                <ModalHeader toggle={props.unsetInvoiceToBeDeleted}>Confirm Deletion</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete invoice #{props.invoiceToBeDeleted.number} from {(new Date(props.invoiceToBeDeleted.date)).toLocaleString('bg-BG')}?
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-danger" title="Delete" onClick={props.deleteInvoice(props.invoiceToBeDeleted.id)}>
                        <i className="fa fa-lg fa-trash-o"/>Delete
                    </button>
                    <button className="btn btn-outline-secondary" title="Cancel" onClick={props.unsetInvoiceToBeDeleted}>
                        <i className="fa fa-lg fa-times"/>Cancel
                    </button>
                </ModalFooter>
            </Modal>}
            <div className="row">
                <div className="col-12">
                    <Box title="Invoices">
                        <div className="text-right">
                            <Link className="btn btn-success" to={config.routes.invoices.create}>
                                <i className="fa fa-plus"/>
                            </Link>
                        </div>
                        <table className="mt-3 table">
                            <thead>
                            <tr>
                                <th>Number</th>
                                <th>Date</th>
                                <th>Recipient</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {props && props.items.map((invoice) => {
                                let row = [<tr key={invoice.id} onClick={this.onInvoiceRowClick(invoice.id)}>
                                    <td className={classNames({"border-bottom-0": invoice.hasDetails})}>
                                        {invoice.number}
                                    </td>
                                    <td className={classNames({"border-bottom-0": invoice.hasDetails})}>
                                        {(new Date(invoice.date)).toLocaleString('bg-BG')}
                                    </td>
                                    <td className={classNames({"border-bottom-0": invoice.hasDetails})}>
                                        {invoice.recipient.name}
                                    </td>
                                    <td className={classNames({"border-bottom-0": invoice.hasDetails})}>
                                        {reduce(invoice.items, (result, item) => {
                                            return result + item.pivot.quantity * item.pivot.price
                                        }, 0)}
                                    </td>
                                    <td className={classNames({"border-bottom-0": invoice.hasDetails})}>
                                        <Link className="btn btn-sm btn-warning" title="Edit" to={config.routes.invoices.edit.replace(":id", invoice.id)}>
                                            <i className="fa fa-plus"/>
                                        </Link>
                                        <button className="btn btn-sm btn-danger" title="Delete" onClick={this.onInvoiceDeleteButtonClick(invoice)}>
                                            <i className="fa fa-lg fa-trash-o"/>
                                        </button>
                                    </td>
                                </tr>];

                                if (invoice.hasDetails) {
                                    row.push(<tr className="text-dark" key={invoice.id + "_expand"}>
                                        <td className="border-0" colSpan="5">
                                            show details
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

    onInvoiceRowClick = id => {
        return () => (this.props.toggleInvoiceRowDetails(id));
    };

    onInvoiceDeleteButtonClick = invoice => {
        return () => (this.props.setInvoiceToBeDeleted(invoice));
    };
}

const mapStateToProps = (state, ownProps) => {
    return {...state.invoices};
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleInvoiceRowDetails(id) {
            dispatch(actions.invoices.uiToggleInvoiceRowDetails(id));
        },
        loadInvoices() {
            dispatch(actions.api.invoices.index());
        },
        setInvoiceToBeDeleted(invoice) {
            dispatch(actions.invoices.setInvoiceToBeDeleted(invoice));
        },
        unsetInvoiceToBeDeleted() {
            dispatch(actions.invoices.setInvoiceToBeDeleted(null));
        },
        deleteInvoice(invoiceId) {
            dispatch(actions.api.invoices.deleteInvoice(invoiceId));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceList);