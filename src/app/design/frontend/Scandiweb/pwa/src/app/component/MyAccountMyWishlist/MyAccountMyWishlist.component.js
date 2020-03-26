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
import PropTypes from 'prop-types';

import { ProductType } from 'Type/ProductList';
import FavoriteItem from 'Component/FavoriteItem';

import SourceMyAccountMyWishlist from 'SourceComponent/MyAccountMyWishlist/MyAccountMyWishlist.component';
import './MyAccountMyWishlist.override.style.scss';
import { FAVORITES } from 'Component/Header';

export class MyAccountMyWishlist extends SourceMyAccountMyWishlist {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        isWishlistLoading: PropTypes.bool.isRequired,
        addAllToCart: PropTypes.func.isRequired,
        isWishlistEmpty: PropTypes.bool.isRequired,
        wishlistItems: PropTypes.objectOf(ProductType).isRequired,
        updateBreadcrumbs: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.updateBreadcrumbs();
        this.updateHeaderMod();
    }

    updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const breadcrumbs = [
            {
                url: '/my-favorites',
                name: __('My Favorites')
            },
            {
                url: '/',
                name: __('Home')
            }
        ];

        updateBreadcrumbs(breadcrumbs);
    }

    updateHeaderMod() {
        const { setHeaderState } = this.props;

        setHeaderState({
            name: FAVORITES,
            title: null
        });
    }

    renderProduct = ([id, product]) => <FavoriteItem key={ id } product={ product } />;

    renderProducts() {
        const { wishlistItems } = this.props;
        return Object.entries(wishlistItems).map(this.renderProduct);
    }

    render() {
        return (
            <div block="MyAccountMyWishlist">
                <div block="MyAccountMyWishlist" elem="Title">
                { __('MY FAVORITES') }
                </div>
                { this.renderContent() }
            </div>
        );
    }
}

export default MyAccountMyWishlist;
