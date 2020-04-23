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
import {
    AddToCartContainer as SourceAddToCartContainer,
    mapDispatchToProps,
    mapStateToProps
} from 'SourceComponent/AddToCart/AddToCart.container';
import Event, { EVENT_GTM_PRODUCT_ADD_TO_CART } from 'Util/Event';

export {
    mapDispatchToProps,
    mapStateToProps
};

export class AddToCartContainer extends SourceAddToCartContainer {
    buttonClick(buttonRef) {
        const {
            product,
            onProductValidationError,
            configurableVariantIndex,
            groupedProductQuantity,
            quantity,
            addProduct
        } = this.props;

        buttonRef.current.blur();
        const { variants, type_id } = product;

        if (!this._validateAddToCart()) {
            onProductValidationError(type_id);
            return;
        }

        this.setState({ isLoading: true });

        if (type_id === 'grouped') {
            const { items } = product;

            Promise.all(items.map((item) => {
                const { product: groupedProductItem } = item;

                groupedProductItem.parent = product;
                const quantity = groupedProductQuantity[groupedProductItem.id];
                if (!quantity) return Promise.resolve();

                return addProduct({
                    product: groupedProductItem,
                    quantity
                });
            })).then(() => {
                Event.dispatch(EVENT_GTM_PRODUCT_ADD_TO_CART, {
                    product: {
                        items,
                        quantities: groupedProductQuantity
                    },
                    isGrouped: true
                });

                this._afterAdded();
            });

            return;
        }

        const productToAdd = variants
            ? {
                ...product,
                configurableVariantIndex
            }
            : product;

        addProduct({
            product: productToAdd,
            quantity
        }).then(
            () => {
                Event.dispatch(EVENT_GTM_PRODUCT_ADD_TO_CART, {
                    product: productToAdd,
                    quantity,
                    configurableVariantIndex
                });

                this._afterAdded();
            }
        ).catch(
            () => this.resetLoading()
        );
    }

    _afterAdded() {
        const {
            showNotification,
            setQuantityToDefault
        } = this.props;

        showNotification('success', __('Product added to cart!'));
        setQuantityToDefault();

        this.removeProductFromWishlist();
        this.setState({ isLoading: false });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToCartContainer);
