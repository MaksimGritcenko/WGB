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
import ProductHelper from 'Component/GoogleTagManager/utils';
import BaseEvent from 'Component/GoogleTagManager/events/BaseEvent.event';

export const SPAM_PROTECTION_DELAY = 2000;
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
            isItem = false
        }) => {
            this.handle({ configurableVariantIndex, ...product }, quantity || 1, isItem, massAddAction);
        });
    }

    /**
     * Handle product add to cart
     */
    handler(product, quantity, isItem, massAddAction) {
        if (!massAddAction && this.spamProtection(SPAM_PROTECTION_DELAY)) {
            return;
        }

        const productData = isItem
            ? ProductHelper.getItemData(product)
            : ProductHelper.getProductData(product, true);

        const newProduct = {
            ...productData,
            quantity
        };

        this.pushEventData({
            ecommerce: {
                currencyCode: this.getCurrencyCode(),
                add: {
                    products: [
                        {
                            ...newProduct,
                            availability: true
                        }
                    ]
                },
                cart: this.prepareCartData()
            }
        });
    }
}

export default AddToCartEvent;
