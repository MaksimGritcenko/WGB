import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ProductReturnQuery } from 'Query';
import { OrderDispatcher } from 'Store/Order';
import { showNotification } from 'Store/Notification';
import { customerType } from 'Type/Account';
import DataContainer from 'Util/Request/DataContainer';
import MyAccountNewReturn from './MyAccountNewReturn.component';

export const mapStateToProps = state => ({
    customer: state.MyAccountReducer.customer
});

export const mapDispatchToProps = dispatch => ({
    getOrderList: () => OrderDispatcher.requestOrders(dispatch),
    showNotification: (type, title, error) => dispatch(showNotification(type, title, error)),
});

export class MyAccountNewReturnContainer extends DataContainer {
    static propTypes = {
        customer: customerType.isRequired,
        showNotification: PropTypes.func.isRequired
    };

    containerFunctions = {
        getShippingAddress: this.getShippingAddress.bind(this)
    };

    componentDidMount() {
        this.requestData();
    }

    getShippingAddress() {
        const { customer: { addresses = [] } } = this.props;
        const key = 'default_shipping';

        return addresses.find(({ [key]: defaultAddress }) => defaultAddress);
    }

    requestData() {
        const { showNotification } = this.props;

        this.fetchData(
            [
                ProductReturnQuery.getgetReturnReasonsFields(),
                ProductReturnQuery.getReturnResolutionsFields(),
                ProductReturnQuery.getItemConditionsFields()
            ],
            (data) => {
                console.log("data", data);
            },
            e => showNotification('error', 'Error fetching New Return!', e)
        );
    }

    render() {
        return (
            <MyAccountNewReturn
              { ...this.props }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountNewReturnContainer);
