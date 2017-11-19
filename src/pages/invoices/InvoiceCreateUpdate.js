import React, {Component} from 'react';
import {connect} from "react-redux";
import {Field, FieldArray, reduxForm} from 'redux-form'

import actions from "../../actions"
import config from "../../config";
import DocumentTitle from "../../components/DocumentTitle";
import {Box} from "../../components/Box";

import 'react-widgets/dist/css/react-widgets.css'

const renderInvoiceItems = ({invoiceItems, fields, meta: {error, submitFailed}}) => (
    <div className="form-group">
        <h3>Invoice Items</h3>
        <label className="form-control-label">Choose existing: </label>
        <select className="form-control" onSelect={(ev) => {
            let item = ev.currentTarget.value;
            if (item.id) {
                fields.push(item);
            }
        }}>
            {invoiceItems && invoiceItems.map(item => {
                return <option value={item}>{item.name}</option>;
            })}
        </select>
        {submitFailed && error && <span>{error}</span>}
        <table className="table">
            <thead>
            <tr>
                <th>Number</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {fields.map((item, index) => (
                <tr key={index}>
                    <td>
                        <Field
                            name={`${item}.number`}
                            type="number"
                            component="input"
                            value={index + 1}
                        />
                    </td>
                    <td>
                        <span>{`${item}.name`}</span>
                    </td>
                    <td>
                        <Field
                            name={`${item}.quantity`}
                            type="number"
                            component="input"
                            placeholder="Quantity"
                        />
                    </td>
                    <td>
                        <Field
                            name={`${item}.price`}
                            type="text"
                            component="input"
                            placeholder="Price"
                        />
                    </td>
                    <td>
                        <button
                            className="btn btn-danger"
                            type="button"
                            title="Remove Item"
                            onClick={() => fields.remove(index)}
                        />
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

const InvoiceForm = reduxForm({
    form: "invoiceForm"
})(props => {
    const {handleSubmit, pristine, reset, submitting} = props;
    return <form onSubmit={handleSubmit((values, dispatch, props) => {
        dispatch(props.saveInvoice(values));
    })}>
        <div className="form-group">
            <label className="form-control-label">Number</label>
            <Field name="number" component="input" type="text" placeholder="Number" className="form-control"/>
        </div>
        <div className="form-group">
            <label className="form-control-label">Date</label>
            <Field name="date" component="input" type="date" placeholder="Date" className="form-control"/>
        </div>
        <div className="form-group">
            <label className="form-control-label">Recipient</label>
            <Field component="select" name="recipientId" className="form-control">
                {props.recipients && props.recipients.map(recipient => {
                    return <option value={recipient.id}>{recipient.name} - {recipient.mol}</option>;
                })}
            </Field>
        </div>
        <FieldArray name="items" component={renderInvoiceItems} props={{invoiceItems: props.invoiceItems}}/>
        <div className="form-group">
            <input type="submit" value="Signin" className="btn btn-primary"/>
        </div>
    </form>;
});

class InvoiceCreateUpdate extends Component {
    constructor(props) {
        super(props);

        this.props.loadRecipients();

        if (this.props.invoiceId) {
            this.props.loadInvoice(this.props.invoiceId);
        }
        this.props.loadRecipients();
        this.props.loadInvoiceItems();
    }

    render = () => {
        const props = this.props;
        const isEdit = props.invoiceId && props.invoiceId > 0;
        const pageTitle = isEdit ? config.titles.invoices.edit.replace("{:number}", props.selectedInvoice.number) : config.titles.invoices.create;

        return <div className="container-fluid">
            <DocumentTitle title={pageTitle}/>
            <div className="row">
                <div className="col-12">
                    <Box title={pageTitle}>
                        <InvoiceForm {...props} {...isEdit} />
                    </Box>
                </div>
            </div>
        </div>;
    };
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...state.invoices,
        invoiceItems: state.invoiceItems.items,
        recipients: state.recipients.items,
        invoiceId: ownProps.match.params.id
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadInvoice(invoiceId) {
            dispatch(actions.api.invoices.show(invoiceId));
        },
        loadRecipients() {
            dispatch(actions.api.recipients.index());
        },
        loadInvoiceItems() {
            dispatch(actions.api.invoiceItems.index());
        },
        saveInvoice(invoice) {
            if (invoice.id) {
                dispatch(actions.api.invoices.update(invoice));
            } else {
                dispatch(actions.api.invoices.store(invoice));
            }
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceCreateUpdate);