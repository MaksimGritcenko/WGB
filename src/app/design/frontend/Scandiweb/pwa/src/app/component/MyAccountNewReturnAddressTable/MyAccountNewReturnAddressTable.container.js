import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { customerType } from 'Type/Account';
import MyAccountNewReturnAddressTable from './MyAccountNewReturnAddressTable.component';

export const mapStateToProps = state => ({
    customer: state.MyAccountReducer.customer
});

export class MyAccountNewReturnAddressTableContainer extends PureComponent {
    static propTypes = {
        customer: customerType.isRequired
    };

    containerFunctions = {
        getShippingAddress: this.getShippingAddress.bind(this)
    };

    getShippingAddress() {
        const { customer: { addresses = [] } } = this.props;
        const key = 'default_shipping';

        return addresses.find(({ [key]: defaultAddress }) => defaultAddress);
    }

    render() {
        return (
            <MyAccountNewReturnAddressTable
              { ...this.props }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps)(MyAccountNewReturnAddressTableContainer);
