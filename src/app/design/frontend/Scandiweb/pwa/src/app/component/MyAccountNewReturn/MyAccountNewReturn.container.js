import DataContainer from 'Util/Request/DataContainer';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ProductReturnQuery, OrderQuery } from 'Query';
import { OrderDispatcher } from 'Store/Order';
import { showNotification } from 'Store/Notification';
import { customerType } from 'Type/Account';
import { fetchMutation, fetchQuery } from 'Util/Request';
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
        showSuccessNotification: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        reasonData: {},
        isLoading: false,
        orderId: '',
        items: [],
        customFields: {},
        contactData: {},
        createdAt: '',
        shippingCover: {},
        policy: {}
    };

    containerFunctions = {
        getShippingAddress: this.getShippingAddress.bind(this),
        onNewRequestSubmit: this.onNewRequestSubmit.bind(this)
    };

    componentDidMount() {
        this.requestData();
        this.requestPolicy();
    }

    onError = (e) => {
        const { showNotification } = this.props;

        this.setState({ isLoading: false }, () => {
            showNotification('error', 'Error mutation New Return!', e);
        });
    };

    onNewRequestSubmit(options) {
        const { showSuccessNotification, history } = this.props;
        const mutation = ProductReturnQuery.getNewReturnMutation(options);

        this.setState({ isLoading: true });

        return fetchMutation(mutation).then(
            ({ createReturnRequest: { return_id } }) => {
                this.setState({ isLoading: false }, () => {
                    showSuccessNotification(__(`Return successfully made, order ID: ${ return_id }`));
                });

                history.goBack();
            },
            this.onError
        );
    }

    getShippingAddress() {
        const { customer: { addresses = [] } } = this.props;
        const key = 'default_shipping';

        return addresses.find(({ [key]: defaultAddress }) => defaultAddress);
    }

    requestPolicy() {
        return this.fetchData(
            [ProductReturnQuery.getRmaPolicy()],
            ({ getRmaPolicy }) => this.setState({ policy: getRmaPolicy }),
            e => showNotification('error', 'Error fetching Policy Data!', e)
        );
    }

    requestData() {
        const { showNotification, history: { location: { pathname } } } = this.props;

        const orderId = pathname
            .split('/')[3]
            .split('&')[1]
            .split('=')[1];

        return fetchQuery([
            ProductReturnQuery.getRmaConfiguration(),
            OrderQuery.getOrderByIdQuery(orderId)
        ]).then(
            ({
                getRmaConfiguration: {
                    reasons,
                    resolutions,
                    conditions,
                    custom_fields: customFields,
                    contact_data: contactData
                }, getOrderById: {
                    order_products: items,
                    base_order_info: { created_at: createdAt }
                }
            }) => {
                const reasonBlock = { reasons, resolutions, conditions };

                const reasonData = Object.entries(reasonBlock).reduce((acc, [key, values]) => ({
                    ...acc,
                    [key.substring(0, key.length - 1)]: values.map(({ [`${ key.substring(0, key.length - 1) }_id`]: id, title }) => (
                        {
                            label: title,
                            value: id
                        }
                    ))
                }), {});

                const shippingCover = reasons.reduce((acc, { reason_id, payer }) => ({
                    ...acc, [reason_id]: payer
                }), {});

                this.setState({
                    reasonData,
                    items,
                    orderId,
                    customFields,
                    contactData,
                    createdAt,
                    shippingCover
                });
            },
            e => showNotification('error', 'Error fetching New Return!', e)
        );
    }

    render() {
        const {
            reasonData,
            items,
            orderId,
            isLoading,
            customFields,
            contactData,
            createdAt,
            shippingCover
        } = this.state;

        return (
            <MyAccountNewReturn
              { ...this.props }
              { ...this.state }
              { ...this.containerFunctions }
              reasonData={ reasonData }
              items={ items }
              orderId={ orderId }
              isLoading={ isLoading }
              customFields={ customFields }
              contactData={ contactData }
              createdAt={ createdAt }
              shippingCover={ shippingCover }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountNewReturnContainer);
