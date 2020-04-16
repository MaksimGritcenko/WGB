import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MY_ACCOUNT_URL } from 'Route/MyAccount/MyAccount.container';
import MyAccountNewReturnCustomerTable from 'Component/MyAccountNewReturnCustomerTable';
import MyAccountAddressTable from 'Component/MyAccountAddressTable';
import MyAccountNewReturnItemSelect from 'Component/MyAccountNewReturnItemSelect';
import Field from 'Component/Field';
import Link from 'Component/Link';
import { ADDRESS_BOOK } from 'Type/Account';

import './MyAccountNewReturn.style';

const BANK_NAME = 'bankName';
const Bank_IFS_C_CODE = 'bankIFSCCode';
const BANK_ACCOUNT_NUMBER = 'bankAccountNumber';

export default class MyAccountNewReturn extends PureComponent {
    static propTypes = {
        getShippingAddress: PropTypes.func.isRequired
    };

    state = {
        bankDetails: {
            [BANK_NAME]: '',
            [Bank_IFS_C_CODE]: '',
            [BANK_ACCOUNT_NUMBER]: ''
        },
        selectedItems: []
    };

    handleBankDetailFieldChange = (value, id) => {
        const { bankDetails } = this.state;

        this.setState({ bankDetails: { ...bankDetails, [id]: value } });
    };

    handleSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
    };

    renderNoDefaultAddressConfigured(name) {
        return (
            <div key={ name }>
                <p block="MyAccountDashboard" elem="Info">{ __('No %s address configured.', name) }</p>
                { this.renderLinkToAddressBook() }
            </div>
        );
    }

    renderLinkToAddressBook() {
        return (
            <p block="MyAccountDashboard" elem="Info">
                <Link to={ `${ MY_ACCOUNT_URL }/${ ADDRESS_BOOK }` }>
                    { __('Go to "Address Book", to configure them!') }
                </Link>
            </p>
        );
    }

    renderDefaultAddressTable() {
        const { getShippingAddress } = this.props;
        const name = __('shipping');
        const address = getShippingAddress();

        if (!address) return this.renderNoDefaultAddressConfigured(name);

        return (
            <div
              key={ name }
              block="MyAccountDashboard"
              elem="DefaultAddress"
            >
                <MyAccountAddressTable
                  address={ address }
                  showAdditionalFields
                  title={ __('Default %s address', name) }
                />
            </div>
        );
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
                //   onClick={  }
                >
                    { __('SUBMIT REQUEST') }
                </button>
                <button
                  block="Button"
                  mods={ { isHollow: true } }
                //   onClick={  }
                >
                    { __('CANCEL') }
                </button>
            </div>
        );
    }

    renderCustomerTable() {
        return (
            <div
              block="MyAccountNewReturn"
              elem="CustomerTable"
            >
                <h4
                  block="MyAccountNewReturn"
                  elem="CustomerTableTitle"
                >
                    My profile
                </h4>
                <MyAccountNewReturnCustomerTable />
            </div>
        );
    }

    render() {
        return (
            <div block="MyAccountNewReturn">
                <div
                  block="MyAccountNewReturn"
                  elem="CustomerAndAddressBlocks"
                >
                    { this.renderCustomerTable() }
                    { this.renderDefaultAddressTable() }
                </div>
                <MyAccountNewReturnItemSelect
                  onItemChange={ this.handleSelectedItemsChange }
                />
                { this.renderBankDetailFields() }
                { this.renderActions() }
            </div>
        );
    }
}
