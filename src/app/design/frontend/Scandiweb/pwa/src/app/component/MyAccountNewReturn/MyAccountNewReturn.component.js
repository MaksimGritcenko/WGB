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
        customFields: PropTypes.object.isRequired,
        renderPageTitle: PropTypes.func.isRequired,
        contactData: PropTypes.object.isRequired,
        createdAt: PropTypes.string.isRequired
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
        const { customFields: { fields = [], label } } = this.props;

        if (!fields.length) return null;

        return (
            <div>
                <h4
                  block="MyAccountNewReturn"
                  elem="BankDetailTitle"
                >
                    { label }
                </h4>
                { fields.map(this.renderBankDetailField) }
            </div>
        );
    }

    renderActions() {
        const { selectedItems } = this.state;

        const isSubmitDisabled = !Object.keys(selectedItems).length;

        return (
            <div
              block="MyAccountNewReturn"
              elem="Actions"
            >
                <button
                  block="Button"
                  onClick={ this.handleRequestSubmitPress }
                  disabled={ isSubmitDisabled }
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
        const {
            reasonData,
            items,
            renderPageTitle,
            contactData,
            createdAt
        } = this.props;
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
                  contactData={ contactData }
                  createdAt={ createdAt }
                />
                { this.renderBankDetailFields() }
                { this.renderActions() }
            </div>
        );
    }
}
