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
    CMS_PAGE,
    URL_REWRITE,
    PASSWORD_CHANGE
} from 'Component/Header';

import MyAccountWishlist from 'Component/MyAccountMyWishlist';
import NotificationList from 'Component/NotificationList';
import NavigationTabs from 'Component/NavigationTabs';

import GoogleTagManagerRouteWrapperComponent from 'Component/GoogleTagManager/GoggleTagManagerRouteWrapper.component';

import {
    BEFORE_ITEMS_TYPE,
    AFTER_ITEMS_TYPE,
    SWITCH_ITEMS_TYPE,
    mapStateToProps,
    mapDispatchToProps,
    AppRouter as SourceAppRouter
} from 'SourceRoute';

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
    constructor(props) {
        super(props);

        this[SWITCH_ITEMS_TYPE].push(
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

    [SWITCH_ITEMS_TYPE] = [
        {
            component: <Route
              path="/"
              exact
              render={ props => (
                <GoogleTagManagerRouteWrapperComponent route={ HOME_PAGE }>
                    <HomePage { ...props } />
                </GoogleTagManagerRouteWrapperComponent>
              ) }
            />,
            position: 10
        },
        {
            component: <Route
              path="/category"
              render={ props => (
                <GoogleTagManagerRouteWrapperComponent route={ CATEGORY }>
                    <CategoryPage { ...props } />
                </GoogleTagManagerRouteWrapperComponent>
              ) }
            />,
            position: 20
        },
        {
            component: <Route
              path="/search/:query/"
              render={ props => (
                <GoogleTagManagerRouteWrapperComponent route={ SEARCH }>
                    <SearchPage { ...props } />
                </GoogleTagManagerRouteWrapperComponent>
              ) }
            />,
            position: 25
        },
        {
            component: <Route
              path="/product"
              render={ props => (
                <GoogleTagManagerRouteWrapperComponent route={ PDP }>
                    <ProductPage { ...props } />
                </GoogleTagManagerRouteWrapperComponent>
              ) }
            />,
            position: 30
        },
        {
            component: <Route
              path="/page"
              render={ props => (
                <GoogleTagManagerRouteWrapperComponent route={ CMS_PAGE }>
                    <CmsPage { ...props } />
                </GoogleTagManagerRouteWrapperComponent>
              ) }
            />,
            position: 40
        },
        {
            component: <Route
              path="/cart"
              exact
              render={ props => (
                <GoogleTagManagerRouteWrapperComponent route={ CART }>
                    <CartPage { ...props } />
                </GoogleTagManagerRouteWrapperComponent>
              ) }
            />,
            position: 50
        },
        {
            component: <Route
              path="/checkout/:step?"
              render={ props => (
                <GoogleTagManagerRouteWrapperComponent route={ CHECKOUT }>
                    <Checkout { ...props } />
                </GoogleTagManagerRouteWrapperComponent>
              ) }
            />,
            position: 55
        },
        {
            component: <Route
              path="/:account*/createPassword/"
              render={ props => (
                <GoogleTagManagerRouteWrapperComponent route={ PASSWORD_CHANGE }>
                    <PasswordChangePage { ...props } />
                </GoogleTagManagerRouteWrapperComponent>
              ) }
            />,
            position: 60
        },
        {
            component: <Route
              path="/my-account/:tab?"
              render={ props => (
                <GoogleTagManagerRouteWrapperComponent route={ CUSTOMER_ACCOUNT }>
                    <MyAccount { ...props } />
                </GoogleTagManagerRouteWrapperComponent>
              ) }
            />,
            position: 70
        },
        {
            component: <Route
              path="/menu"
              render={ props => (
                <GoogleTagManagerRouteWrapperComponent route={ MENU }>
                    <MenuPage { ...props } />
                </GoogleTagManagerRouteWrapperComponent>
              ) }
            />,
            position: 80
        },
        {
            component: <Route path="/my-favorites" exact component={ MyAccountWishlist } />,
            position: 90
        },
        {
            component: <Route
              render={ props => (
                <GoogleTagManagerRouteWrapperComponent route={ URL_REWRITE }>
                    <UrlRewrites { ...props } />
                </GoogleTagManagerRouteWrapperComponent>
              ) }
            />,
            position: 1000
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
