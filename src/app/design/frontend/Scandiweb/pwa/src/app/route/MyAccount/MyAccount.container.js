/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */
import { connect } from 'react-redux';

import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { BreadcrumbsDispatcher } from 'Store/Breadcrumbs';
import { HistoryType } from 'Type/Common';
import { changeNavigationState } from 'Store/Navigation';
import { MyAccountDispatcher } from 'Store/MyAccount';
import { toggleOverlayByKey } from 'Store/Overlay';
import { updateMeta } from 'Store/Meta';

import {
    ADDRESS_BOOK,
    DASHBOARD,
    MY_WISHLIST,
    MY_ORDERS,
    NEWSLETTER_SUBSCRIPTION
} from 'Type/Account';

import { MyAccountContainer as SourceMyAccountContainer }
    from 'SourceRoute/MyAccount/MyAccount.container';

export const MY_ACCOUNT_URL = '/my-account';

export const mapStateToProps = state => ({
    isSignedIn: state.MyAccountReducer.isSignedIn
});

export const mapDispatchToProps = dispatch => ({
    updateBreadcrumbs: breadcrumbs => BreadcrumbsDispatcher.update(breadcrumbs, dispatch),
    changeHeaderState: state => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    requestCustomerData: () => MyAccountDispatcher.requestCustomerData(dispatch),
    toggleOverlayByKey: key => dispatch(toggleOverlayByKey(key)),
    updateMeta: meta => dispatch(updateMeta(meta))
});

export class MyAccountContainer extends SourceMyAccountContainer {
    static propTypes = {
        history: HistoryType.isRequired
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

    changeActiveTab(activeTab) {
        const { history } = this.props;
        const { [activeTab]: { url } } = this.tabMap;
        if (url === '/my-favorites') {
            history.push(`${ url }`);
        } else {
            history.push(`${ MY_ACCOUNT_URL }${ url }`);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountContainer);
