import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MyAccountNewReturnCustomerTable from 'Component/MyAccountNewReturnCustomerTable';
import MyAccountNewReturnAddressTable from 'Component/MyAccountNewReturnAddressTable';
import MyAccountNewReturnItemSelect from 'Component/MyAccountNewReturnItemSelect';
import Loader from 'Component/Loader';
import Field from 'Component/Field';

import './MyAccountNewReturn.style';

export default class MyAccountNewReturn extends PureComponent {
    static propTypes = {
        reasonData: PropTypes.object.isRequired,
        onNewRequestSubmit: PropTypes.func.isRequired,
        orderId: PropTypes.string.isRequired,
        history: PropTypes.object.isRequired,
        isLoading: PropTypes.bool.isRequired,
        items: PropTypes.array.isRequired,
        customFields: PropTypes.array.isRequired,
        renderPageTitle: PropTypes.func.isRequired
    };

    state = {
        bankDetails: {},
        selectedItems: {},
        hasItemsError: false
    };

    handleBankDetailFieldChange = (value, id) => {
        const { bankDetails } = this.state;

        this.setState({ bankDetails: { ...bankDetails, [id]: value } });
    };

    handleSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
    };

    handleRequestSubmitPress = () => {
        const { orderId, onNewRequestSubmit } = this.props;
        const { selectedItems, bankDetails } = this.state;

        if (!Object.keys(selectedItems).length) return;

        const isAllFilled = !Object.values(selectedItems).find(selectedItem => (
            Object.values(selectedItem).find(item => !item) !== undefined
        ));

        if (!isAllFilled) {
            this.setState({ hasItemsError: true });

            return;
        }

        const custom_fields = Object.entries(bankDetails).map(([code, value]) => ({ code, value }));

        onNewRequestSubmit({
            items: selectedItems,
            order_id: orderId,
            custom_fields
        });
    };

    handleBackPress = () => {
        const { history } = this.props;

        history.goBack();
    };

    renderBankDetailField = ({ code, label }) => {
        const { bankDetails: { [code]: value } } = this.state;

        return (
            <Field
              type="text"
              placeholder={ label }
              id={ code }
              name={ code }
              mix={ {
                  block: 'MyAccountNewReturn',
                  elem: 'BankDetailField'
              } }
              onChange={ value => this.handleBankDetailFieldChange(value, code) }
              value={ value }
              validation={ ['notEmpty'] }
            />
        );
    };

    renderBankDetailFields() {
        const { customFields } = this.props;

        if (!customFields.length) return null;

        return (
            <div>
                <h4
                  block="MyAccountNewReturn"
                  elem="BankDetailTitle"
                >
                    Bank Details:
                </h4>
                { customFields.map(this.renderBankDetailField) }
            </div>
        );
    }

    renderActions() {
        return (
            <div
              block="MyAccountNewReturn"
              elem="Actions"
            >
                <button
                  block="Button"
                  onClick={ this.handleRequestSubmitPress }
                >
                    { __('SUBMIT REQUEST') }
                </button>
                <button
                  block="Button"
                  mods={ { isHollow: true } }
                  onClick={ this.handleBackPress }
                >
                    { __('CANCEL') }
                </button>
            </div>
        );
    }

    renderLoader() {
        const { isLoading } = this.props;
        return <Loader isLoading={ isLoading } />;
    }

    render() {
        const { reasonData, items, renderPageTitle } = this.props;
        const { hasItemsError } = this.state;

        return (
            <div block="MyAccountNewReturn">
                { this.renderLoader() }
                { renderPageTitle() }
                <div
                  block="MyAccountNewReturn"
                  elem="CustomerAndAddressBlocks"
                >
                    <MyAccountNewReturnCustomerTable />
                    <MyAccountNewReturnAddressTable />
                </div>
                <MyAccountNewReturnItemSelect
                  onItemChange={ this.handleSelectedItemsChange }
                  reasonData={ reasonData }
                  items={ items }
                  hasError={ hasItemsError }
                />
                { this.renderBankDetailFields() }
                { this.renderActions() }
            </div>
        );
    }
}
