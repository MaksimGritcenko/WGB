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

import Event, {
    EVENT_GTM_PRODUCT_ADD_TO_CART, EVENT_GTM_PRODUCT_REMOVE_FROM_CART
} from 'Util/Event';
import {
    CartItemContainer as SourceCartItemContainer,
    mapDispatchToProps
} from 'SourceComponent/CartItem/CartItem.container';

export { mapDispatchToProps };

export class CartItemContainer extends SourceCartItemContainer {
    /**
     * Handle item quantity change. Check that value is <1
     * @param {Number} value new quantity
     * @return {void}
     */
    handleChangeQuantity(quantity) {
        const { item, item: { sku, product, qty } } = this.props;

        if (qty < quantity) {
            Event.dispatch(EVENT_GTM_PRODUCT_ADD_TO_CART, {
                product: { ...product, sku },
                quantity: quantity - qty
            });
        } else {
            Event.dispatch(EVENT_GTM_PRODUCT_REMOVE_FROM_CART, {
                item,
                quantity: qty - quantity
            });
        }

        this.setState({ isLoading: true }, () => {
            const { changeItemQty, item: { item_id, sku } } = this.props;
            this.hideLoaderAfterPromise(changeItemQty({ item_id, quantity, sku }));
        });
    }

    /**
     * @return {void}
     */
    handleRemoveItem() {
        this.setState({ isLoading: true }, () => {
            const { removeProduct, item } = this.props;
            const { item_id, qty: quantity } = item;

            this.hideLoaderAfterPromise(removeProduct(item_id));
            Event.dispatch(EVENT_GTM_PRODUCT_REMOVE_FROM_CART, {
                item,
                quantity
            });
        });
    }
}

export default connect(null, mapDispatchToProps)(CartItemContainer);
