import { HistoryType } from 'Type/Common';
import {
    MyAccountContainer,
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps as sourceMapStateToProps,
    MY_ACCOUNT_URL
} from 'SourceRoute/MyAccount/MyAccount.container';
import PropTypes from 'prop-types';
import { setAuthorizationToken, getAuthorizationToken } from 'Util/Auth';
import { convertQueryStringToKeyValuePairs } from 'Util/Url';
import { updateCustomerSignInStatus } from 'Store/MyAccount';
import { showNotification } from 'Store/Notification';
import { connect } from 'react-redux';
import {
    ADDRESS_BOOK,
    DASHBOARD,
    MY_WISHLIST,
    MY_ORDERS,
    NEWSLETTER_SUBSCRIPTION
} from 'Type/Account';

import { CUSTOMER_ACCOUNT_PAGE } from 'Component/Header';

export * from 'SourceRoute/MyAccount/MyAccount.container';

const mapDispatchToProps = dispatch => ({
    ...sourceMapDispatchToProps(dispatch),
    updateIsSignedIn: state => dispatch(updateCustomerSignInStatus(state)),
    showNotification: (type, message) => dispatch(showNotification(type, message))
});

const mapStateToProps = state => ({
    ...sourceMapStateToProps(state)
});

class MyAccount extends MyAccountContainer {
    static propTypes = {
        ...super.propTypes,
        history: HistoryType.isRequired,
        showNotification: PropTypes.func.isRequired
    };

    tabMap = {
        [DASHBOARD]: {
            url: '/dashboard',
            name: __('Dashboard')
        },
        [ADDRESS_BOOK]: {
            url: '/address-book',
            name: __('Address book')
        },
        [MY_WISHLIST]: {
            url: '/my-favorites',
            name: __('My Favorites')
        },
        [MY_ORDERS]: {
            url: '/my-orders',
            name: __('My orders')
        },
        [NEWSLETTER_SUBSCRIPTION]: {
            url: '/newsletter-subscription',
            name: __('Newsletter Subscription')
        }
    };

    onSignIn() {
        const {
            requestCustomerData,
            changeHeaderState,
            isSignedIn,
            history
        } = this.props;

        if (isSignedIn) {
            requestCustomerData();
        }

        changeHeaderState({
            name: CUSTOMER_ACCOUNT_PAGE,
            onBackClick: () => history.push('/')
        });
    }

    redirectIfNotSignedIn() {
        const {
            isSignedIn, requestCustomerData, history: { location: { search } }, history, updateIsSignedIn
        } = this.props;
        const { token } = convertQueryStringToKeyValuePairs(search);

        if (token) {
            setAuthorizationToken(token);
            updateIsSignedIn(true);
            requestCustomerData();
            history.push(`${ MY_ACCOUNT_URL }/${ DASHBOARD }`);
        }

        if (!isSignedIn && !getAuthorizationToken()) {
            history.push('/');
        }
    }

    changeActiveTab(activeTab) {
        const { history } = this.props;
        const { [activeTab]: { url } } = this.tabMap;
        if (activeTab === MY_WISHLIST) {
            history.push(`${ url }`);
        } else {
            history.push(`${ MY_ACCOUNT_URL }${ url }`);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
