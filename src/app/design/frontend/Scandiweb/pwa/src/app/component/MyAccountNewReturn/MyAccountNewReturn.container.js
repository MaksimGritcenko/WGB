import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ProductReturnQuery, OrderQuery } from 'Query';
import { OrderDispatcher } from 'Store/Order';
import { showNotification } from 'Store/Notification';
import { customerType } from 'Type/Account';
import DataContainer from 'Util/Request/DataContainer';
import { fetchMutation } from 'Util/Request';
import MyAccountNewReturn from './MyAccountNewReturn.component';

export const RETURN_REASONS = 'returnReasons';
export const RETURN_RESOLUTIONS = 'returnResolutions';
export const ITEM_CONDITIONS = 'itemConditions';

export const mapStateToProps = state => ({
    customer: state.MyAccountReducer.customer
});

export const mapDispatchToProps = dispatch => ({
    getOrderList: () => OrderDispatcher.requestOrders(dispatch),
    showNotification: (type, title, error) => dispatch(showNotification(type, title, error)),
    showSuccessNotification: message => dispatch(showNotification('success', message))
});

export class MyAccountNewReturnContainer extends DataContainer {
    static propTypes = {
        customer: customerType.isRequired,
        showNotification: PropTypes.func.isRequired,
        showSuccessNotification: PropTypes.func.isRequired
    };

    state = {
        reasonData: {},
        isLoading: false
    }

    containerFunctions = {
        getShippingAddress: this.getShippingAddress.bind(this),
        onNewRequestSubmit: this.onNewRequestSubmit.bind(this)
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
        const { showNotification, history: { location: { pathname } } } = this.props;

        const orderId = pathname
            .split('/')[3]
            .split('&')[1]
            .split('=')[1];

        this.fetchData(
            [
                ProductReturnQuery.getRmaConfiguration(),
                OrderQuery.getOrderByIdQuery(orderId)
            ],
            ({ getRmaConfiguration, getOrderById: { order_products: items } }) => {
                const reasonData = Object.entries(getRmaConfiguration).reduce((acc, [key, values]) => ({
                    ...acc,
                    [key]: values.map(({ [`${ key.substring(0, key.length - 1) }_id`]: id, title }) => (
                        {
                            label: title,
                            value: id
                        }
                    ))
                }), {});

                this.setState({ reasonData, items });
            },
            e => showNotification('error', 'Error fetching New Return!', e)
        );
    }

    onError = (e) => {
        const { showNotification } = this.props;

        this.setState({ isLoading: false }, () => {
            showNotification('error', 'Error mutation New Return!', e);
        });
    };

    onNewRequestSubmit(options) {
        const { showSuccessNotification } = this.props;
        const mutation = ProductReturnQuery.getNewReturnMutation(options);

        this.setState({ isLoading: true });

        return fetchMutation(mutation).then(
            ({ return_id }) => {
                this.setState({ isLoading: false }, () => {
                    showSuccessNotification(__(`Return successfully made, order ID: ${ return_id }`));
                });
            },
            this.onError
        );
    }

    render() {
        const { reasonData, items } = this.state;

        return (
            <MyAccountNewReturn
              { ...this.props }
              { ...this.containerFunctions }
              reasonData={ reasonData }
              items={ items }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountNewReturnContainer);
