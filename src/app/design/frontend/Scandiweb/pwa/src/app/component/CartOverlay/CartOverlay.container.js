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

import isMobile from 'Util/Mobile';
import { CART, CART_EDITING } from 'Component/Header';
import {
    CartOverlayContainer as SourceCartOverlayContainer,
    mapStateToProps as sourceMapStateToProps,
    mapDispatchToProps
} from 'SourceComponent/CartOverlay/CartOverlay.container';

export { mapDispatchToProps };

export const mapStateToProps = state => ({
    ...sourceMapStateToProps(state),
    guest_checkout: state.ConfigReducer.guest_checkout
});

export const CART_OVERLAY_ID = 'cart-overlay';

export class CartOverlayContainer extends SourceCartOverlayContainer {
    changeHeaderState() {
        const { changeHeaderState, totals: { count = 0 } } = this.props;
        const title = __('%s Items', count || 0);
        const name = isMobile.any() ? CART : CART_OVERLAY_ID;

        changeHeaderState({
            name,
            title,
            onEditClick: () => {
                this.setState({ isEditing: true });
                changeHeaderState({
                    name: CART_EDITING,
                    title,
                    onOkClick: () => this.setState({ isEditing: false }),
                    onCancelClick: () => this.setState({ isEditing: false })
                });
            },
            onCloseClick: () => this.setState({ isEditing: false })
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartOverlayContainer);
