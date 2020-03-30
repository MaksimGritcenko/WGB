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

import ProductPrice from 'Component/ProductPrice';
import PropTypes from 'prop-types';
import ProductAttributeValue from 'Component/ProductAttributeValue';
import SourceProductCard from 'SourceComponent/ProductCard/ProductCard.component';
import './ProductCard.style';

export const HERO_ATTRIBUTE = 'NEW';

/**
 * Product card
 * @class ProductCard
 */
export default class ProductCard extends SourceProductCard {
    static propTypes = {
        ...this.propTypes,
        isHero: PropTypes.bool
    };

    static defaultProps = {
        ...this.defaultProps,
        isHero: false
    };

    renderProductPrice() {
        const { productOrVariant: { price } } = this.props;
        if (!price) return null;

        return (
            <ProductPrice
              price={ price }
              mix={ { block: 'ProductCard', elem: 'Price' } }
            />
        );
    }

    renderAdditionalProductDetails() {
        const { product: { sku }, getAttribute, isHero } = this.props;
        const { product_list_content: { attribute_to_display = '' } = {} } = window.contentConfiguration;
        const brand = getAttribute(attribute_to_display);

        if (!sku || !isHero) return null;

        const attribute = brand
            ? (
                <ProductAttributeValue
                  attribute={ brand }
                  isFormattedAsText
                />
            )
            : HERO_ATTRIBUTE;

        return (
            <div
              block="ProductCard"
              elem="Brand"
              mods={ { isLoaded: !!brand } }
              itemProp="brand"
            >
                { attribute }
            </div>
        );
    }
}
