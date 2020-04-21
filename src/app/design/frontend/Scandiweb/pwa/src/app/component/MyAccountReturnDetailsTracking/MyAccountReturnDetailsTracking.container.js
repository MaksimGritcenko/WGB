import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ProductReturnQuery } from 'Query';
import Loader from 'Component/Loader';
import { OrderDispatcher } from 'Store/Order';
import { showNotification } from 'Store/Notification';
import { customerType } from 'Type/Account';
import DataContainer from 'Util/Request/DataContainer';
import { fetchMutation } from 'Util/Request';
import MyAccountReturnDetailsTracking from './MyAccountReturnDetailsTracking.component';

export const mapStateToProps = state => ({
    customer: state.MyAccountReducer.customer
});

export const mapDispatchToProps = dispatch => ({
    getOrderList: () => OrderDispatcher.requestOrders(dispatch),
    showSuccessNotification: message => dispatch(showNotification('success', message))
});

export class MyAccountReturnDetailsTrackingContainer extends DataContainer {
    static propTypes = {
        ...this.propTypes,
        customer: customerType.isRequired,
        showSuccessNotification: PropTypes.func.isRequired
    };

    containerFunctions = {
        handleTrackingInformationAdd: this.handleTrackingInformationAdd.bind(this)
    };

    state = {
        isLoading: false
    };

    handleTrackingInformationAdd(options) {
        const { showSuccessNotification } = this.props;
        const mutation = ProductReturnQuery.getReturnTrackingInfo(options);

        this.setState({ isLoading: true });

        return fetchMutation(mutation).then(
            () => {
                this.setState({ isLoading: false }, () => {
                    showSuccessNotification(__(`Tracking information successfully saved!`));
                });

                return true;
            },
            this.onError
        );
    }

    render() {
        const { isLoading } = this.state;

        return (
            <div>
                <Loader isLoading={ isLoading } />
                <MyAccountReturnDetailsTracking
                  { ...this.props }
                  { ...this.containerFunctions }
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountReturnDetailsTrackingContainer);
