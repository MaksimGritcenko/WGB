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

    componentDidMount() {
        const { orderList, getOrderList } = this.props;
        if (!orderList) {
            getOrderList();
        }
    }

    render() {
        return (
            <MyAccountMyReturns
              { ...this.props }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountMyReturnsContainer);
