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

import { updateTotals } from 'Store/Cart';
import { CartQuery } from 'Query';
import { isSignedIn } from 'Util/Auth';
import { fetchQuery } from 'Util/Request';
import BrowserDatabase from 'Util/BrowserDatabase';
import GoogleTagManager from 'Component/GoogleTagManager/GoogleTagManager.component';
import { LinkedProductsDispatcher, updateLinkedProducts } from 'Store/LinkedProducts';
import { CartDispatcher as SourceCartDispatcher, GUEST_QUOTE_ID } from 'SourceStore/Cart/Cart.dispatcher';

export { GUEST_QUOTE_ID };

/**
 * Product Cart Dispatcher
 * @class CartDispatcher
 */
export class CartDispatcher extends SourceCartDispatcher {
    _syncCartWithBE(dispatch) {
        // Need to get current cart from BE, update cart
        fetchQuery(CartQuery.getCartQuery(
            !isSignedIn() && this._getGuestQuoteId()
        )).then(
            ({ cartData }) => this._updateCartData(cartData, dispatch),
            () => {
                this._createEmptyCart(dispatch).then((data) => {
                    BrowserDatabase.setItem(data, GUEST_QUOTE_ID);
                    this._updateCartData({}, dispatch);
                    GoogleTagManager.getInstance().setGroupedProducts({});
                });
            }
        );
    }

    _updateCartData(cartData, dispatch) {
        dispatch(updateTotals(cartData));
        const { items = [] } = cartData;

        if (items.length > 0) {
            const product_links = items.reduce((links, product) => {
                const { product: { product_links, variants = [] }, sku: variantSku } = product;

                const { product_links: childProductLinks } = variants.find(({ sku }) => sku === variantSku) || {};

                if (childProductLinks) {
                    Object.values(childProductLinks).filter(({ link_type }) => link_type === 'crosssell')
                        .map(item => links.push(item));
                }

                if (product_links) {
                    Object.values(product_links).filter(({ link_type }) => link_type === 'crosssell')
                        .map(item => links.push(item));
                }

                return links;
            }, []);

            if (product_links.length !== 0) {
                LinkedProductsDispatcher.handleData(dispatch, product_links);
            }
        } else {
            dispatch(updateLinkedProducts({ crossSell: { items: [] } }));
        }
    }
}

export default new CartDispatcher();
