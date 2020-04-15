import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { OrderDispatcher } from 'Store/Order';
import { ordersType } from 'Type/Account';
import MyAccountMyReturns from './MyAccountMyReturns.component';

export const mapStateToProps = state => ({
    orderList: state.OrderReducer.orderList,
    isLoading: state.OrderReducer.isLoading
});

export const mapDispatchToProps = dispatch => ({
    getOrderList: () => OrderDispatcher.requestOrders(dispatch)
});

export class MyAccountMyReturnsContainer extends PureComponent {
    static propTypes = {
        orderList: ordersType.isRequired,
        getOrderList: PropTypes.func.isRequired
    };

    containerFunctions = {
        setChosenOrderId: this.setChosenOrderId.bind(this),
        handleReturnClick: this.handleReturnClick.bind(this)
    };

    componentDidMount() {
        const { orderList, getOrderList } = this.props;
        if (!orderList) {
            getOrderList();
        }
    }

    setChosenOrderId(id) {
        this.chosenOrderId = id;
    }

    handleReturnClick() {
        window.alert('TODO implement');
    }

    render() {
        return (
            <MyAccountMyReturns
              { ...this.props }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountMyReturnsContainer);
