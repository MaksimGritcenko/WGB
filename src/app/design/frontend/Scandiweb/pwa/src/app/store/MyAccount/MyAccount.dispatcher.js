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

import { updateCustomerSignInStatus, updateCustomerDetails } from 'Store/MyAccount';
import { executeGet, executePost, fetchMutation } from 'Util/Request';
import { deleteAuthorizationToken, setAuthorizationToken } from 'Util/Auth';
import { WishlistDispatcher } from 'Store/Wishlist';
import { showNotification } from 'Store/Notification';
import { prepareMutation, prepareQuery } from 'Util/Query';
import { CartDispatcher } from 'Store/Cart';
import { MyAccountQuery } from 'Query';
import { history } from 'Route';
import BrowserDatabase from 'Util/BrowserDatabase';
import { ORDERS } from 'Store/Order/Order.reducer';
import ProductHelper from 'Component/GoogleTagManager/utils';
import Event, { EVENT_GTM_USER_LOGIN, EVENT_GTM_USER_REGISTER } from 'Util/Event';
import { MyAccountDispatcher as SourceMyAccountDispatcher } from 'SourceStore/MyAccount/MyAccount.dispatcher';
import GoogleTagManager, { GROUPED_PRODUCTS_GUEST } from 'Component/GoogleTagManager/GoogleTagManager.component';

export const CUSTOMER = 'customer';
export const LOGOUT_SUCCESS_STATUS = 'true';

export const ONE_MONTH_IN_SECONDS = 2628000;

/**
 * My account actions
 * @class MyAccount
 */
export class MyAccountDispatcher extends SourceMyAccountDispatcher {
    requestCustomerData(dispatch) {
        const query = MyAccountQuery.getCustomerQuery();

        const customer = BrowserDatabase.getItem(CUSTOMER) || {};
        if (customer.id) {
            dispatch(updateCustomerDetails(customer));
        }

        return executePost({ ...prepareQuery([query]), cache: 'no-cache' }).then(
            ({ customer }) => {
                dispatch(updateCustomerDetails(customer));
                BrowserDatabase.setItem(customer, CUSTOMER, ONE_MONTH_IN_SECONDS);
                this.transferGroupeProductsData(customer.id);
                GoogleTagManager.getInstance().updateGroupedProductsStorageName(customer.id);
                // Event.dispatch(EVENT_GTM_USER_LOGIN);
            },
            error => dispatch(showNotification('error', error[0].message))
        );
    }

    /**
     * transfer grouped products data from guest to logged in user
     *
     * @param {numbre} id customer id
     */
    transferGroupeProductsData(id) {
        const GTMInstance = GoogleTagManager.getInstance();
        if (GTMInstance.groupedProductsStorageName !== GROUPED_PRODUCTS_GUEST) return;
        const guestGroupedProducts = GTMInstance.getGroupedProducts();
        GTMInstance.setGroupedProducts({});
        GTMInstance.updateGroupedProductsStorageName(id);
        const userGroupedProducts = GTMInstance.getGroupedProducts();

        const result = ProductHelper.mergeGroupedProducts(guestGroupedProducts, userGroupedProducts);
        GTMInstance.setGroupedProducts(result);
    }

    logout(_, dispatch) {
        const logoutQuery = MyAccountQuery.getLogoutMutation();

        const preparedQuery = prepareMutation([logoutQuery]);

        const customer = BrowserDatabase.getItem(CUSTOMER) || {};
        if (!customer.id) {
            return;
        }

        GoogleTagManager.getInstance().updateGroupedProductsStorageName();

        executeGet(preparedQuery);
        dispatch(updateCustomerSignInStatus(false));
        deleteAuthorizationToken();
        CartDispatcher.updateInitialCartData(dispatch);
        WishlistDispatcher.updateInitialWishlistData(dispatch);
        BrowserDatabase.deleteItem(ORDERS);
        BrowserDatabase.deleteItem(CUSTOMER);
        history.push('/');
    }

    createAccount(options = {}, dispatch) {
        const { customer: { email }, password } = options;
        const mutation = MyAccountQuery.getCreateAccountMutation(options);

        return fetchMutation(mutation).then(
            (data) => {
                const { createCustomer: { customer } } = data;
                const { confirmation_required } = customer;

                if (confirmation_required) {
                    return 2;
                }

                Event.dispatch(EVENT_GTM_USER_REGISTER);
                return this.signIn({ email, password }, dispatch);
            },
            (error) => {
                dispatch(showNotification('error', error[0].message));
                return Promise.reject();
            }
        );
    }

    async signIn(options = {}, dispatch) {
        const mutation = MyAccountQuery.getSignInMutation(options);
        try {
            const result = await fetchMutation(mutation);
            const { generateCustomerToken: { token } } = result;
            setAuthorizationToken(token);
            dispatch(updateCustomerSignInStatus(true));
            CartDispatcher.updateInitialCartData(dispatch);
            WishlistDispatcher.updateInitialWishlistData(dispatch);
            Event.dispatch(EVENT_GTM_USER_LOGIN);

            return true;
        } catch ([e]) {
            throw e;
        }
    }
}

export default new MyAccountDispatcher();
