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

import Link from 'Component/Link';
import ProductPrice from 'Component/ProductPrice';
import PropTypes from 'prop-types';
import Event, { EVENT_GTM_PRODUCT_CLICK } from 'Util/Event';
import CategoryProductAttributeValue from 'Component/CategoryProductAttributeValue';
import SourceProductCard from 'SourceComponent/ProductCard/ProductCard.component';
import './ProductCard.style';

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

    handleClick = () => {
        const { product, currentVariantIndex: configurableVariantIndex } = this.props;
        Event.dispatch(EVENT_GTM_PRODUCT_CLICK, { ...product, configurableVariantIndex });

        this.registerSharedElement();
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

    renderCardWrapper(children) {
        const { linkTo, product: { url_key } } = this.props;

        if (!url_key) {
            return (<div>{ children }</div>);
        }

        return (
            <Link
              block="ProductCard"
              elem="Link"
              to={ linkTo }
              onClick={ this.handleClick }
            >
              { children }
            </Link>
        );
    }

    renderAdditionalProductDetails() {
        const { product: { sku }, getAttribute, isHero } = this.props;
        const { product_list_content: { attribute_to_display = 'brand' } = {} } = window.contentConfiguration;
        const brand = getAttribute(attribute_to_display) || {};

        if (!isHero || !sku || !Object.keys(brand).length) return null;

        return (
            <div
              block="ProductCard"
              elem="Brand"
              mods={ { isLoaded: !!brand } }
            >
                <CategoryProductAttributeValue
                  attribute={ brand }
                  isFormattedAsText
                />
            </div>
        );
    }
}
