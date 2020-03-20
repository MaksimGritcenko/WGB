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

import ProductAttributeValue from 'Component/ProductAttributeValue';
import SourceProductCard from 'SourceComponent/ProductCard/ProductCard.component';

/**
 * Product card
 * @class ProductCard
 */
export default class ProductCard extends SourceProductCard {
    renderAdditionalProductDetails() {
        const { product: { sku }, getAttribute } = this.props;
        const { product_list_content: { attribute_to_display } = {} } = window.contentConfiguration;
        const brand = getAttribute(attribute_to_display || 'brand') || {};

        // if (sku && !brand) return null;

        return (
            <div
              block="ProductCard"
              elem="Brand"
              mods={ { isLoaded: !!sku } }
              itemProp="brand"
            >
                <ProductAttributeValue
                  attribute={ brand }
                  isFormattedAsText
                />
            </div>
        );
    }
}
