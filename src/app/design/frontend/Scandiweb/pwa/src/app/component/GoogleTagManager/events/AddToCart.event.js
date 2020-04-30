/* eslint-disable import/no-cycle */
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

import Event, { EVENT_GTM_PRODUCT_ADD_TO_CART } from 'Util/Event';
import BrowserDatabase from 'Util/BrowserDatabase';
import ProductHelper from 'Component/GoogleTagManager/utils';
import BaseEvent from 'Component/GoogleTagManager/events/BaseEvent.event';

export const GROUPED_CART_PRODUCTS = 'GROUPED_CART_PRODUCTS';
export const SPAM_PROTECTION_DELAY = 200;
/**
 * Product add to cart event
 */
class AddToCartEvent extends BaseEvent {
    /**
     * Bind add to cart
     */
    bindEvent() {
        Event.observer(EVENT_GTM_PRODUCT_ADD_TO_CART, ({
            product,
            quantity,
            configurableVariantIndex,
            massAddAction = false,
            isGrouped = false,
            isItem = false
        }) => {
            this.handle({ configurableVariantIndex, ...product }, quantity || 1, isItem, isGrouped, massAddAction);
        });
    }

    /**
     * Handle product add to cart
     */
    handler(product, quantity, isItem, isGrouped, massAddAction) {
        if (!massAddAction && this.spamProtection(SPAM_PROTECTION_DELAY)) {
            return;
        }

        const products = [];

        if (isGrouped) {
            const { items, quantities } = product;
            // eslint-disable-next-line fp/no-let
            let groupedProductPrice = 0;

            items.forEach(
                ({ product }) => {
                    const { id } = product;
                    const productToPush = {
                        ...ProductHelper.getProductData(product, true),
                        quantity: quantities[id],
                        availability: true
                    };

                    const { price, quantity } = productToPush;
                    groupedProductPrice += price * quantity;

                    products.push(productToPush);
                }
            );

            // const groupedCartProducts = BrowserDatabase.getItem(GROUPED_CART_PRODUCTS);
            // BrowserDatabase.setItem(GROUPED_CART_PRODUCTS, )
            products.push(ProductHelper.getProductData({ ...product, groupedProductPrice }));
        } else {
            const { type_id } = product;
            const productData = isItem
                ? ProductHelper.getItemData(product)
                : ProductHelper.getProductData(product, type_id === 'configurable');

            products.push({
                ...productData,
                quantity,
                availability: true
            });
        }

        this.pushEventData({
            ecommerce: {
                currencyCode: this.getCurrencyCode(),
                add: {
                    products
                },
                cart: this.prepareCartData()
            }
        });
    }
}

export default AddToCartEvent;
