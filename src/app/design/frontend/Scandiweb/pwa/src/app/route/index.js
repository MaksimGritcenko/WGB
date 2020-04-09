/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-len */
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import React, { lazy } from 'react';

import Header, {
    PDP,
    CATEGORY,
    CUSTOMER_ACCOUNT,
    HOME_PAGE,
    MENU,
    SEARCH,
    CART,
    CHECKOUT,
    SIGN_IN,
    CMS_PAGE,
    FAVORITES,
    CONTACT_US,
    URL_REWRITE,
    PASSWORD_CHANGE
} from 'Component/Header';

import MyAccountWishlist from 'Component/MyAccountMyWishlist';
import NotificationList from 'Component/NotificationList';
import GoogleTagManager from 'Component/GoogleTagManager';
import NavigationTabs from 'Component/NavigationTabs';
import MyAccountSignIn from 'Route/MyAccountSignIn';
import ContactPage from 'Component/ContactPage';
import CookiePopup from 'Component/CookiePopup';

import { HeaderAndFooterDispatcher } from 'Store/HeaderAndFooter';
import { ConfigDispatcher } from 'Store/Config';
import { CartDispatcher } from 'Store/Cart';
import { WishlistDispatcher } from 'Store/Wishlist';
import { ContactInfoDispatcher } from 'Store/ContactInfo';
import withGTM from 'Component/GoogleTagManager/withGtm.hoc';

import Store from 'Store';

import {
    BEFORE_ITEMS_TYPE,
    AFTER_ITEMS_TYPE,
    SWITCH_ITEMS_TYPE,
    mapStateToProps,
    mapDispatchToProps,
    AppRouter as SourceAppRouter
} from 'SourceRoute';
import BackToTop from 'Component/BackToTop';

export const CartPage = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/CartPage'));
export const CategoryPage = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/CategoryPage'));
export const Checkout = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/Checkout'));
export const CmsPage = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/CmsPage'));
export const HomePage = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/HomePage'));
export const MyAccount = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/MyAccount'));
export const NoMatchHandler = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/NoMatchHandler'));
export const PasswordChangePage = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/PasswordChangePage'));
export const ProductPage = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/ProductPage'));
export const SearchPage = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/SearchPage'));
export const SomethingWentWrong = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/SomethingWentWrong'));
export const UrlRewrites = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/UrlRewrites'));
export const MenuPage = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/MenuPage'));

export {
    BEFORE_ITEMS_TYPE,
    AFTER_ITEMS_TYPE,
    history
} from 'SourceRoute';

export class AppRouter extends SourceAppRouter {
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
        },
        {
            component: <GoogleTagManager />,
            position: 40
        }
    ];

    [SWITCH_ITEMS_TYPE] = [
        {
            component: <Route
              path="/"
              exact
              render={ withGTM(HomePage, HOME_PAGE) }
            />,
            position: 10
        },
        {
            component: <Route
              path="/category"
              render={ withGTM(CategoryPage, CATEGORY) }
            />,
            position: 20
        },
        {
            component: <Route
              path="/search/:query/"
              render={ withGTM(SearchPage, SEARCH) }
            />,
            position: 25
        },
        {
            component: <Route
              path="/product"
              render={ withGTM(ProductPage, PDP) }
            />,
            position: 30
        },
        {
            component: <Route
              path="/page"
              render={ withGTM(CmsPage, CMS_PAGE) }
            />,
            position: 40
        },
        {
            component: <Route
              path="/cart"
              exact
              render={ withGTM(CartPage, CART) }
            />,
            position: 50
        },
        {
            component: <Route
              path="/checkout/:step?"
              render={ withGTM(Checkout, CHECKOUT) }
            />,
            position: 55
        },
        {
            component: <Route
              path="/:account*/createPassword/"
              render={ withGTM(PasswordChangePage, PASSWORD_CHANGE) }
            />,
            position: 60
        },
        {
            component: <Route
              path="/my-account/:tab?"
              render={ withGTM(MyAccount, CUSTOMER_ACCOUNT) }
            />,
            position: 70
        },
        {
            component: <Route
              path="/menu"
              render={ withGTM(MenuPage, MENU) }
            />,
            position: 80
        },
        {
            component: <Route
              path="/my-favorites"
              render={ withGTM(MyAccountWishlist, FAVORITES) }
            />,
            position: 90
        },
        {
            component: <Route
              path="/contact-us"
              render={ withGTM(ContactPage, CONTACT_US) }
            />,
            position: 100
        },
        {
            component: <Route
              path="/signin"
              render={ withGTM(MyAccountSignIn, SIGN_IN) }
            />,
            position: 110
        },
        {
            component: <Route
              render={ withGTM(UrlRewrites, URL_REWRITE) }
            />,
            position: 1000
        }
    ];

    [AFTER_ITEMS_TYPE] = [
        {
            component: <CookiePopup />,
            position: 20
        },
        {
            component: <BackToTop />,
            position: 10
        }
    ];

    getHeaderAndFooterOptions() {
        return {
            footer: { identifiers: this.getCmsBlocksToRequest() }
        };
    }

    dispatchActions() {
        WishlistDispatcher.updateInitialWishlistData(Store.dispatch);
        CartDispatcher.updateInitialCartData(Store.dispatch);
        ConfigDispatcher.handleData(Store.dispatch);
        HeaderAndFooterDispatcher.handleData(Store.dispatch, this.getHeaderAndFooterOptions());
        ContactInfoDispatcher.handleData(Store.dispatch, this.getContactInfoOptions());
    }

    getContactInfoOptions() {
        return { identifiers: ['contact-us-social'] };
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
