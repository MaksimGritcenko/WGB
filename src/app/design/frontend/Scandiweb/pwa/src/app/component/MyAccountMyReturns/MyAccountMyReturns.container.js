import { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MyAccountNewReturn from 'Component/MyAccountNewReturn';
import MyAccountReturnDetails from 'Component/MyAccountReturnDetails';
import { MY_RETURN as HEADER_MY_RETURN } from 'Component/Header';
import { changeNavigationState } from 'Store/Navigation';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { OrderDispatcher } from 'Store/Order';
import { ReturnDispatcher } from 'Store/Return';
import { ordersType } from 'Type/Account';
import MyAccountMyReturns from './MyAccountMyReturns.component';

export const mapStateToProps = state => ({
    orderList: state.OrderReducer.orderList,
    areOrdersLoading: state.OrderReducer.isLoading,
    returnList: state.ReturnReducer.returnList,
    areReturnsLoading: state.ReturnReducer.isLoading
});

export const mapDispatchToProps = dispatch => ({
    getOrderList: () => OrderDispatcher.requestOrders(dispatch),
    getReturnList: () => ReturnDispatcher.requestReturns(dispatch),
    changeHeaderState: state => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state))
});

const MY_RETURN = 'myReturn';
const NEW_RETURN = 'newReturn';
const RETURN_DETAILS = 'returnDetails';

export class MyAccountMyReturnsContainer extends PureComponent {
    static propTypes = {
        orderList: ordersType.isRequired,
        getOrderList: PropTypes.func.isRequired,
        returnList: PropTypes.array.isRequired,
        getReturnList: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        changeHeaderState: PropTypes.func.isRequired
    };

    state = {
        activePage: this.getActivePage()
    };

    renderMap = {
        [MY_RETURN]: {
            component: MyAccountMyReturns,
            title: 'My Return'
        },
        [NEW_RETURN]: {
            component: MyAccountNewReturn,
            title: 'New Return for Order #'
        },
        [RETURN_DETAILS]: {
            component: MyAccountReturnDetails,
            title: 'Return #'
        }
    };

    containerFunctions = {
        setChosenOrderId: this.setChosenOrderId.bind(this),
        handleReturnClick: this.handleReturnClick.bind(this),
        handleReturnItemClick: this.handleReturnItemClick.bind(this)
    };

    componentDidMount() {
        const {
            orderList, getOrderList,
            returnList, getReturnList
        } = this.props;

        if (!orderList.length) {
            getOrderList();
        }

        if (!returnList.length) {
            getReturnList();
        }
    }

    componentDidUpdate() {
        const { activePage: prevActivePage } = this.state;
        const activePage = this.getActivePage();

        if (prevActivePage !== activePage) {
            this.handlePageChange();
        }
    }

    getActivePage() {
        const { history: { location: { pathname } } } = this.props;

        const pathNameIndex = 3;
        const url = pathname.split('/')[pathNameIndex];

        if (!url) return MY_RETURN;
        if (url.split('&')[0] === 'new-return') return NEW_RETURN;

        return RETURN_DETAILS;
    }

    setChosenOrderId(id) {
        this.chosenOrderId = id;
    }

    handlePageChange() {
        const activePage = this.getActivePage();

        if (activePage === NEW_RETURN || activePage === RETURN_DETAILS) this.changeHeaderState();

        this.setState({ activePage });
    }

    handleReturnClick(selectedOrderId) {
        const { history } = this.props;

        history.push({ pathname: `/my-account/my-returns/new-return&id=${ selectedOrderId }` });
        this.handlePageChange();
    }

    handleReturnItemClick(returnId) {
        const { history } = this.props;

        history.push({ pathname: `/my-account/my-returns/return-details&id=${ returnId }` });
        this.handlePageChange();
    }

    changeHeaderState() {
        const {
            changeHeaderState,
            history
        } = this.props;

        changeHeaderState({
            name: HEADER_MY_RETURN,
            title: 'my return',
            onBackClick: () => history.goBack()
        });
    }

    renderPageTitle = () => {
        const { activePage } = this.state;

        const { title } = this.renderMap[activePage];

        return (
            <h1
              block="MyAccount"
              elem="Heading"
            >
                { title }
            </h1>
        );
    };

    render() {
        const { activePage } = this.state;

        const { component: Page } = this.renderMap[activePage];

        return (
            <Page
              { ...this.props }
              { ...this.containerFunctions }
              renderPageTitle={ this.renderPageTitle }
            />
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyAccountMyReturnsContainer));
