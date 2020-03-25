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

import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Link from 'Component/Link';
import FavoriteItemCard from 'Component/FavoriteItemCard';
import { ProductType, FilterType } from 'Type/ProductList';

import './FavoriteItem.style';

export default class FavoriteItem extends PureComponent {
    static propTypes = {
        addToCart: PropTypes.func,
        product: ProductType.isRequired,
        removeItem: PropTypes.func,
        parameters: FilterType,
        isLoading: PropTypes.bool
    };

    static defaultProps = {
        addToCart: () => {},
        removeItem: () => {},
        parameters: {},
        isLoading: false
    };

    renderAddToCart() {
        const {
            addToCart
        } = this.props;

        return (
            <div block="FavoriteItem" elem="Row">
                <button
                  block="Button"
                  mix={ { block: 'FavoriteItem', elem: 'AddToCart' } }
                  onClick={ addToCart }
                >
                    { __('Add to cart') }
                </button>
            </div>
        );
    }

    renderRemove() {
        const { removeItem } = this.props;

        return (
            <button
              block="Button"
              mix={ { block: 'ButtonsDown', elem: 'Remove' } }
              onClick={ removeItem }
            >
                { __('Remove from Favorites') }
            </button>
        );
    }

    render() {
        const { product, parameters, isLoading } = this.props;

        return (
            <FavoriteItemCard
              product={ product }
              selectedFilters={ parameters }
              mix={ { block: 'FavoriteItem' } }
              isLoading={ isLoading }
            >
                <>
                    { this.renderAddToCart() }
                    <div block="FavoriteItem" elem="ButtonsDown">
                        <Link
                          block="ButtonsDown"
                          elem="View"
                          to={ product.url_key }
                        >
                            { __('View Item') }
                        </Link>
                        { this.renderRemove() }
                    </div>
                </>
            </FavoriteItemCard>
        );
    }
}
