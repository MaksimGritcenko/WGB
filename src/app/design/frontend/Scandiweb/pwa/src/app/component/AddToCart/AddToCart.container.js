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
        const { variants, type_id, configurable_options = {} } = product;

        if (!this._validateAddToCart()) {
            onProductValidationError(type_id);
            return;
        }

        const { attributes = [] } = configurableVariantIndex >= 0 && variants.length
            ? variants[configurableVariantIndex]
            : {};

        const parameters = Object.values(attributes).reduce(
            (parameters, { attribute_code, attribute_value }) => {
                const option = Object.values(configurable_options)
                    .find(({ attribute_code: code }) => code === attribute_code);

                if (option) return { ...parameters, [attribute_code]: attribute_value };

                return parameters;
            }, {}
        );

        Event.dispatch(EVENT_GTM_PRODUCT_ADD_TO_CART, {
            product,
            quantity,
            configurableVariantIndex,
            parameters
        });

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
            })).then(() => this._afterAdded());

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
            () => this._afterAdded()
        ).catch(
            () => this.resetLoading()
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToCartContainer);
