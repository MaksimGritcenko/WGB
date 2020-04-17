import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MyAccountNewReturn from 'Component/MyAccountNewReturn';
import MyAccountReturnDetails from 'Component/MyAccountReturnDetails';
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

const MY_RETURN = 'myReturn';
const NEW_RETURN = 'newReturn';
const RETURN_DETAILS = 'returnDetails';

export class MyAccountMyReturnsContainer extends PureComponent {
    static propTypes = {
        orderList: ordersType.isRequired,
        getOrderList: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        activePage: this.getActivePage()
    }

    renderMap = {
        [MY_RETURN]: MyAccountMyReturns,
        [NEW_RETURN]: MyAccountNewReturn,
        [RETURN_DETAILS]: MyAccountReturnDetails
    }

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

    componentDidUpdate(prevProps) {
        const { history: { location: { pathname: prevPathname } } } = prevProps;
        const { history: { location: { pathname } } } = this.props;

        if (prevPathname !== pathname) {
            this.handlePageChange();
        }
    }

    getActivePage() {
        const { history: { location: { pathname } } } = this.props;

        const url = pathname.split('/')[3];

        if (!url) return MY_RETURN;
        if (url.split('&')[0] === 'new-return') return NEW_RETURN;

        return RETURN_DETAILS;
    }

    setChosenOrderId(id) {
        this.chosenOrderId = id;
    }

    handlePageChange() {
        this.setState({ activePage: this.getActivePage() });
    }

    handleReturnClick(selectedOrderId) {
        const { history } = this.props;

        history.push({ pathname: `/my-account/my-returns/new-return&id=${ selectedOrderId }` });
        this.handlePageChange();
    }

    render() {
        const { activePage } = this.state;

        const Page = this.renderMap[activePage];

        return (
            <Page
              { ...this.props }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountMyReturnsContainer);
