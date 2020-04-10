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

import debounceRender from 'react-debounce-render';
import PropTypes from 'prop-types';
import ProductCard from 'Component/ProductCard';
import {
    ProductList as SourceProductList, observerThreshold, RENDER_PAGE_FREQUENCY
} from 'SourceComponent/ProductList/ProductList.component';
import './ProductList.style';

export { observerThreshold, RENDER_PAGE_FREQUENCY };
export const HERO_PRODUCT_NUMBER = 5;

/**
 * List of category products
 * @class CategoryProductList
 */
export class ProductList extends SourceProductList {
    static propTypes = {
        ...this.propTypes,
        isForCategory: PropTypes.bool
    };

    static defaultProps = {
        ...this.defaultProps,
        isForCategory: false
    };

    renderNoProducts() {
        return (
            <div block="CategoryProductList">
                <div
                  block="CategoryProductList"
                  elem="ProductsMissing"
                >
                    <p
                      block="CategoryProductList"
                      elem="ProductsMissingText"
                    >
                        { __('Unfortunately there are no items matching your request.') }
                    </p>
                </div>
            </div>
        );
    }

    renderPages() {
        const {
            selectedFilters,
            isForCategory,
            isLoading,
            pages,
            mix
        } = this.props;

        if (isLoading) return null;

        return Object.entries(pages).map(([pageNumber, items = []]) => (
            <ul
              block="CategoryProductList"
              elem="Page"
              mix={ { ...mix, elem: 'Page' } }
              key={ pageNumber }
              ref={ (node) => { this.nodes[pageNumber] = node; } }
            >
                { items.map((product, i) => {
                    const heroProduct = i % HERO_PRODUCT_NUMBER === 0
                    // as Hero product is only for category page
                        ? { isHero: isForCategory, mix: { block: 'ProductCard', elem: 'Hero' } }
                        : {};

                    return (
                        <ProductCard
                          product={ product }
                          key={ product.id }
                          selectedFilters={ selectedFilters }
                          { ...heroProduct }
                        />
                    );
                }) }
            </ul>
        ));
    }
}

export default debounceRender(ProductList, RENDER_PAGE_FREQUENCY, { leading: false });
