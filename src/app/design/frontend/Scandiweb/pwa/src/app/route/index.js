// importing the necessary module to implement the "default export"
import { connect } from 'react-redux';
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

import Header from 'Component/Header';
import MyAccountWishlist from 'Component/MyAccountMyWishlist';
import NotificationList from 'Component/NotificationList';
import NavigationTabs from 'Component/NavigationTabs';

// importing all parts of original header planned to modify
import {
    BEFORE_ITEMS_TYPE,
    AFTER_ITEMS_TYPE,
    SWITCH_ITEMS_TYPE,
    mapStateToProps,
    mapDispatchToProps,
    AppRouter as SourceAppRouter
} from 'SourceRoute';

// export all unmodified exports from original file
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
    SearchPage,
    SomethingWentWrong,
    UrlRewrites,
    MenuPage,
    BEFORE_ITEMS_TYPE,
    AFTER_ITEMS_TYPE,
    history
} from 'SourceRoute';

export const StyleGuide = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/StyleGuide'));

// modify the intended part of the logic, notice, the class is also exported!
export class AppRouter extends SourceAppRouter {
    constructor(props) {
        super(props);

        this[SWITCH_ITEMS_TYPE].push(
            {
                component: <Route path="/styleguide" exact component={ StyleGuide } />,
                position: 11
            },
            {
                component: <Route path="/my-favorites" exact component={ MyAccountWishlist } />,
                position: 90
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
}

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
