import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MY_ACCOUNT_URL } from 'Route/MyAccount/MyAccount.container';
import MyAccountAddressTable from 'Component/MyAccountAddressTable';
import Link from 'Component/Link';
import { ADDRESS_BOOK } from 'Type/Account';

export default class MyAccountNewReturnCustomerTable extends PureComponent {
    static propTypes = {
        getShippingAddress: PropTypes.func.isRequired
    };

    renderLinkToAddressBook() {
        return (
            <p block="MyAccountDashboard" elem="Info">
                <Link to={ `${ MY_ACCOUNT_URL }/${ ADDRESS_BOOK }` }>
                    { __('Go to "Address Book", to configure them!') }
                </Link>
            </p>
        );
    }

    renderNoDefaultAddressConfigured(name) {
        return (
            <div key={ name }>
                <p block="MyAccountDashboard" elem="Info">{ __('No default %s address configured.', name) }</p>
                { this.renderLinkToAddressBook() }
            </div>
        );
    }

    render() {
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
}
