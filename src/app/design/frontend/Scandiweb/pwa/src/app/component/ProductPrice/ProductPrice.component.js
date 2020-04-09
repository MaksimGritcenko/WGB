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
import './ProductPrice.style.override';

/**
 * Product price
 * @class ProductPrice
 */
export default class ProductPrice extends SourceProductPrice {
    renderCurrentPrice() {
        const {
            discountPercentage,
            isSchemaRequired,
            formatedCurrency,
            currency
        } = this.props;

        const schema = isSchemaRequired ? { itemProp: 'lowPrice' } : {};

        // Use <ins></ins> <del></del> to represent new price and the old (deleted) one
        const PriceSemanticElementName = discountPercentage > 0 ? 'ins' : 'span';

        return (
            <PriceSemanticElementName>
                <data
                  value={ formatedCurrency }
                >
                    <span { ...schema }>{ formatedCurrency }</span>
                <span>{ ` ${ currency }` }</span>
                </data>
            </PriceSemanticElementName>
        );
    }

    renderOldPrice() {
        const {
            roundedRegularPrice,
            discountPercentage,
            isSchemaRequired,
            currency
        } = this.props;

        const schema = isSchemaRequired ? { itemProp: 'highPrice' } : {};

        return (
            <del
              block="ProductPrice"
              elem="HighPrice"
              mods={ { isVisible: discountPercentage > 0 } }
              aria-label={ __('Old product price') }
            >
                <span { ...schema }>{ roundedRegularPrice }</span>
                <span>{ ` ${ currency }` }</span>
            </del>
        );
    }
}
