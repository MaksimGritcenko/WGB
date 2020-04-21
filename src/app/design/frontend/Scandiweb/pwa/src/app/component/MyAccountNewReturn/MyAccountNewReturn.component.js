import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MyAccountNewReturnCustomerTable from 'Component/MyAccountNewReturnCustomerTable';
import MyAccountNewReturnAddressTable from 'Component/MyAccountNewReturnAddressTable';
import MyAccountNewReturnItemSelect from 'Component/MyAccountNewReturnItemSelect';
import Loader from 'Component/Loader';
import Field from 'Component/Field';

import './MyAccountNewReturn.style';

const BANK_NAME = 'bankName';
const Bank_IFS_C_CODE = 'bankIFSCCode';
const BANK_ACCOUNT_NUMBER = 'bankAccountNumber';

export default class MyAccountNewReturn extends PureComponent {
    static propTypes = {
        reasonData: PropTypes.object.isRequired,
        onNewRequestSubmit: PropTypes.func.isRequired,
        orderId: PropTypes.string.isRequired,
        history: PropTypes.object.isRequired,
        isLoading: PropTypes.bool.isRequired,
        items: PropTypes.array.isRequired
    };

    state = {
        bankDetails: {
            [BANK_NAME]: '',
            [Bank_IFS_C_CODE]: '',
            [BANK_ACCOUNT_NUMBER]: ''
        },
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
        const { selectedItems } = this.state;

        if (!Object.keys(selectedItems).length) return;

        const isAllFilled = !Object.values(selectedItems).find(selectedItem => (
            Object.values(selectedItem).find(item => !item) !== undefined
        ));

        if (!isAllFilled) {
            this.setState({ hasItemsError: true });

            return;
        }

        onNewRequestSubmit({
            items: selectedItems,
            order_id: orderId
        });
    };

    handleBackPress = () => {
        const { history } = this.props;

        history.goBack();
    }

    renderBankDetailField(placeholder, id) {
        const { bankDetails: { [id]: value } } = this.state;

        return (
            <Field
              type="text"
              placeholder={ __(placeholder) }
              id={ id }
              name={ id }
              mix={ {
                  block: 'MyAccountNewReturn',
                  elem: 'BankDetailField'
              } }
              onChange={ value => this.handleBankDetailFieldChange(value, id) }
              value={ value }
              validation={ ['notEmpty'] }
            />
        );
    }

    renderBankDetailFields() {
        return (
            <div>
                <h4
                  block="MyAccountNewReturn"
                  elem="BankDetailTitle"
                >
                    Bank Details:
                </h4>
                { this.renderBankDetailField('Bank Name', BANK_NAME) }
                { this.renderBankDetailField('Bank IFS C Code', Bank_IFS_C_CODE) }
                { this.renderBankDetailField('Bank Account Number', BANK_ACCOUNT_NUMBER) }
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
        const { reasonData, items } = this.props;
        const { hasItemsError } = this.state;

        return (
            <div block="MyAccountNewReturn">
                { this.renderLoader() }
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
