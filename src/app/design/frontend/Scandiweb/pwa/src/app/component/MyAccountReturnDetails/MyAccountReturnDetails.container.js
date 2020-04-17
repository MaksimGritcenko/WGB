import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { OrderDispatcher } from 'Store/Order';
import { showNotification } from 'Store/Notification';
import { customerType } from 'Type/Account';
import DataContainer from 'Util/Request/DataContainer';
import MyAccountReturnDetails from './MyAccountReturnDetails.component';

export const mapStateToProps = state => ({
    customer: state.MyAccountReducer.customer
});

export const mapDispatchToProps = dispatch => ({
    getOrderList: () => OrderDispatcher.requestOrders(dispatch),
    showNotification: (type, title, error) => dispatch(showNotification(type, title, error)),
});

export class MyAccountReturnDetailsContainer extends DataContainer {
    static propTypes = {
        customer: customerType.isRequired,
        showNotification: PropTypes.func.isRequired
    };

    containerFunctions = {
        getShippingAddress: this.getShippingAddress.bind(this)
    };

    componentDidMount() {
        // this.requestData();
    }

    getShippingAddress() {
        const { customer: { addresses = [] } } = this.props;
        const key = 'default_shipping';

        return addresses.find(({ [key]: defaultAddress }) => defaultAddress);
    }

    // requestData() {
    //     const { showNotification } = this.props;

    //     this.fetchData(
    //         [
    //             ProductReturnQuery.getReturnReasonsFields(),
    //             ProductReturnQuery.getReturnResolutionsFields(),
    //             ProductReturnQuery.getItemConditionsFields()
    //         ],
    //         (data) => {
    //             console.log("data", data);
    //         },
    //         e => showNotification('error', 'Error fetching New Return!', e)
    //     );
    // }

    render() {
        return (
            <MyAccountReturnDetails
              { ...this.props }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountReturnDetailsContainer);
