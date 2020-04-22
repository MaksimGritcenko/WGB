import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ProductReturnQuery } from 'Query';
import Loader from 'Component/Loader';
import { OrderDispatcher } from 'Store/Order';
import { showNotification } from 'Store/Notification';
import { fetchMutation, fetchQuery } from 'Util/Request';
import MyAccountReturnDetails from './MyAccountReturnDetails.component';

export const mapStateToProps = state => ({
});

export const mapDispatchToProps = dispatch => ({
    getOrderList: () => OrderDispatcher.requestOrders(dispatch),
    showNotification: (type, title, error) => dispatch(showNotification(type, title, error)),
    showSuccessNotification: message => dispatch(showNotification('success', message))
});

export class MyAccountReturnDetailsContainer extends PureComponent {
    static propTypes = {
        showNotification: PropTypes.func.isRequired,
        showSuccessNotification: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    containerFunctions = {
        handleCancelRMA: this.handleCancelRMA.bind(this)
    };

    state = {
        carriers: [],
        details: {},
        isCancelDisabled: false,
        isLoading: false
    };

    componentDidMount() {
        this.requestData();
    }

    requestData() {
        const { showNotification, history: { location: { pathname } } } = this.props;

        const returnId = pathname
            .split('/')[3]
            .split('&')[1]
            .split('=')[1];

        this.setState({ isLoading: true, isCancelDisabled: true });

        return fetchQuery([
            ProductReturnQuery.getReturnCarriers(),
            ProductReturnQuery.getReturnDetails(returnId)
        ]).then(
            ({ getRmaConfiguration: { carriers: carrierData }, getReturnDetailsById }) => {
                const carriers = Object.values(carrierData).map(({ code, label }) => ({
                    label,
                    value: code
                }));

                this.setState({
                    carriers,
                    details: getReturnDetailsById,
                    isCancelDisabled: false,
                    isLoading: false
                });
            },
            e => showNotification('error', 'Error fetching Return Details!', e)
        );
    }

    handleCancelRMA() {
        const { showSuccessNotification, history } = this.props;
        const { details: { id } } = this.state;

        const mutation = ProductReturnQuery.getCancelReturnRequest({ request_id: id });

        this.setState({ isCancelDisabled: true });

        return fetchMutation(mutation).then(
            () => {
                this.setState({ isCancelDisabled: false }, () => {
                    showSuccessNotification(__('Return successfully canceled!'));
                });

                history.goBack();
            },
            this.onError
        );
    }

    render() {
        const {
            carriers,
            details,
            isLoading,
            isCancelDisabled
        } = this.state;

        return (
            <div>
                <Loader isLoading={ isLoading } />
                <MyAccountReturnDetails
                  { ...this.props }
                  { ...this.containerFunctions }
                  carriers={ carriers }
                  details={ details }
                  isCancelDisabled={ isCancelDisabled }
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountReturnDetailsContainer);
