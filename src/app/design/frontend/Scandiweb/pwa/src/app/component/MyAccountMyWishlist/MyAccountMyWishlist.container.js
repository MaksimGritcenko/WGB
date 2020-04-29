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
import { connect } from 'react-redux';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { changeNavigationState } from 'Store/Navigation';

import { WishlistDispatcher } from 'Store/Wishlist';
import { showNotification } from 'Store/Notification';
import { ProductType } from 'Type/ProductList';
import { BreadcrumbsDispatcher } from 'Store/Breadcrumbs';
import { updateMeta } from 'Store/Meta';
import Event, { EVENT_GTM_IMPRESSIONS_WISHLIST } from 'Util/Event';
import { MyAccountMyWishlistContainer as SourceMyAccountMyWishlistContainer }
    from 'SourceComponent/MyAccountMyWishlist/MyAccountMyWishlist.container';

export const mapStateToProps = state => ({
    wishlistItems: state.WishlistReducer.productsInWishlist,
    isWishlistLoading: state.WishlistReducer.isLoading
});

export const mapDispatchToProps = dispatch => ({
    clearWishlist: () => WishlistDispatcher.clearWishlist(dispatch),
    moveWishlistToCart: () => WishlistDispatcher.moveWishlistToCart(dispatch),
    showNotification: message => dispatch(showNotification('success', message)),
    setHeaderState: stateName => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, stateName)),
    updateMeta: meta => dispatch(updateMeta(meta)),
    updateBreadcrumbs: (breadcrumbs) => {
        BreadcrumbsDispatcher.update(breadcrumbs, dispatch);
    }
});

export class MyAccountMyWishlistContainer extends SourceMyAccountMyWishlistContainer {
    static propTypes = {
        clearWishlist: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        moveWishlistToCart: PropTypes.func.isRequired,
        wishlistItems: PropTypes.objectOf(ProductType).isRequired,
        updateMeta: PropTypes.func.isRequired
    };

    state = {
        isLoading: false
    };

    componentDidMount() {
        const { updateMeta } = this.props;

        updateMeta({ title: __('My Favorites') });
    }

    _gtmImpressions() {
        const { wishlistItems, isWishlistLoading } = this.props;

        if (!isWishlistLoading && Object.keys(wishlistItems).length > 0) {
            const items = Object.values(wishlistItems).reduce((acc, item) => {
                if (!Object.keys(item).length) return acc;

                const { sku, wishlist: { sku: variantSku = sku } = {} } = item;
                return [...acc, { product: item, sku: variantSku }];
            }, []);

            Event.dispatch(EVENT_GTM_IMPRESSIONS_WISHLIST, { items });
        }
    }

    addAllToCart = () => {
        const { moveWishlistToCart } = this.props;

        this.setState({ isLoading: true });

        return moveWishlistToCart().then(
            () => this.showNotificationAndRemoveLoading('Favorite Item moved to cart')
        );
    };

    render() {
        this._gtmImpressions();

        return super.render();
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountMyWishlistContainer);
