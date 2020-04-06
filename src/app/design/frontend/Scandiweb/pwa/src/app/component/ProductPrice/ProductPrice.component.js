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

import SourceProductPrice from 'SourceComponent/ProductPrice/ProductPrice.component';
import TextPlaceholder from 'Component/TextPlaceholder';
import {
    formatCurrency,
    calculateDiscountPercentage,
    calculateFinalPrice,
    roundPrice
} from 'Util/Price';
import './ProductPrice.style.override';

/**
 * Product price
 * @class ProductPrice
 */
export default class ProductPrice extends SourceProductPrice {
    render() {
        const {
            price: { minimalPrice, regularPrice },
            mix
        } = this.props;

        if (!minimalPrice || !regularPrice) {
            return (
                <p block="ProductPrice" aria-label="Product Price" mix={ mix }>
                    <TextPlaceholder mix={ { block: 'ProductPrice', elem: 'Placeholder' } } length="custom" />
                </p>
            );
        }

        const minimalPriceValue = minimalPrice.amount.value;
        const regularPriceValue = regularPrice.amount.value;
        const roundedRegularPrice = roundPrice(regularPriceValue);
        const priceCurrency = regularPrice.amount.currency;
        const discountPercentage = calculateDiscountPercentage(minimalPriceValue, regularPriceValue);
        const finalPrice = calculateFinalPrice(discountPercentage, minimalPriceValue, regularPriceValue);
        const formatedCurrency = roundPrice(finalPrice);
        const currency = formatCurrency(priceCurrency);

        // Use <ins></ins> <del></del> to represent new price and the old (deleted) one
        const PriceSemanticElementName = discountPercentage > 0 ? 'ins' : 'span';

        return (
            <p
              block="ProductPrice"
              mix={ mix }
              aria-label={ `Product price: ${ formatedCurrency }${ currency }` }
              itemProp="offers"
              itemScope
              itemType="https://schema.org/AggregateOffer"
            >
                <PriceSemanticElementName>
                    <data
                      value={ formatedCurrency }
                    >
                        <span itemProp="lowPrice">{ formatedCurrency }</span>
                        <span>{ ` ${ currency }` }</span>
                    </data>
                </PriceSemanticElementName>

                <del
                  block="ProductPrice"
                  elem="HighPrice"
                  mods={ { isVisible: discountPercentage > 0 } }
                  aria-label={ __('Old product price') }
                >
                    <span itemProp="highPrice">{ roundedRegularPrice }</span>
                    <span>{ ` ${ currency }` }</span>
                </del>

                <meta itemProp="priceCurrency" content={ priceCurrency } />
            </p>
        );
    }
}
