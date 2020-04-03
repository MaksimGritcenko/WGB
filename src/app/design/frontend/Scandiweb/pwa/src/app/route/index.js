import { connect } from 'react-redux';
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

import Header from 'Component/Header';
import MyAccountWishlist from 'Component/MyAccountMyWishlist';
import NotificationList from 'Component/NotificationList';
import NavigationTabs from 'Component/NavigationTabs';

import {
    BEFORE_ITEMS_TYPE,
    AFTER_ITEMS_TYPE,
    SWITCH_ITEMS_TYPE,
    mapStateToProps,
    mapDispatchToProps,
    AppRouter as SourceAppRouter
} from 'SourceRoute';

export const SearchPage = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/SearchPage'));

export {
    CartPage,
    CategoryPage,
    Checkout,
    CmsPage,
    HomePage,
    MyAccount,
    NoMatchHandler,
    PasswordChangePage,
    ProductPage,
    UrlRewrites,
    MenuPage,
    BEFORE_ITEMS_TYPE,
    AFTER_ITEMS_TYPE,
    history
} from 'SourceRoute';

export class AppRouter extends SourceAppRouter {
    constructor(props) {
        super(props);

        this[SWITCH_ITEMS_TYPE].push(
            {
                component: <Route path="/my-favorites" exact component={ MyAccountWishlist } />,
                position: 90
            },
            {
                component: <Route path="/search/:query/" exact component={ SearchPage } />,
                position: 100
            }
        );
    }

    [BEFORE_ITEMS_TYPE] = [
        {
            component: <NotificationList />,
            position: 10
        },
        {
            component: <Header />,
            position: 20
        },
        {
            component: <NavigationTabs />,
            position: 25
        }
    ];

    [AFTER_ITEMS_TYPE] = [];

    getHeaderAndFooterOptions() {
        return {
            footer: { identifiers: this.getCmsBlocksToRequest() }
        };
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
