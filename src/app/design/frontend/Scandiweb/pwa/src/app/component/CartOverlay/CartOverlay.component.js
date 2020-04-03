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
import Overlay from 'Component/Overlay';

import SourceCartOverlay from 'SourceComponent/CartOverlay/CartOverlay.component';
import './CartOverlay.style';

export default class CartOverlay extends SourceCartOverlay {
    render() {
        const { changeHeaderState } = this.props;

        return (
            <Overlay
              id="cart-overlay"
              onVisible={ changeHeaderState }
              mix={ { block: 'CartOverlay' } }
            >
                { this.renderPromo() }
                { this.renderCartItems() }
                { this.renderDiscount() }
                { this.renderTax() }
                { this.renderTotals() }
                { this.renderActions() }
            </Overlay>
        );
    }
}
