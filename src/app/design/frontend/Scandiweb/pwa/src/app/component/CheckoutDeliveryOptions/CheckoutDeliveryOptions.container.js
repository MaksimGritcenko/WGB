/* eslint-disable max-len */
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

import Event, { EVENT_GTM_CHECKOUT_OPTION } from 'Util/Event';
import { SHIPPING_STEP } from 'Route/Checkout/Checkout.component';

import SourceCheckoutDeliveryOptionsContainer from 'SourceComponent/CheckoutDeliveryOptions/CheckoutDeliveryOptions.container';

export default class CheckoutDeliveryOptionsContainer extends SourceCheckoutDeliveryOptionsContainer {
    componentDidMount() {
        if (window.formPortalCollector) {
            window.formPortalCollector.subscribe(SHIPPING_STEP, this.collectAdditionalData, 'CheckoutDeliveryOptions');
        }
    }

    componentDidUpdate(_, prevState) {
        const { onShippingMethodSelect, shippingMethods } = this.props;
        const { selectedShippingMethodCode } = this.state;
        const { selectedShippingMethodCode: prevSelectedShippingMethodCode } = prevState;

        if (selectedShippingMethodCode !== prevSelectedShippingMethodCode) {
            const shippingMethod = shippingMethods.find(
                ({ method_code }) => method_code === selectedShippingMethodCode
            );

            Event.dispatch(
                EVENT_GTM_CHECKOUT_OPTION,
                { step: 1, option: selectedShippingMethodCode }
            );
            onShippingMethodSelect(shippingMethod);
        }
    }
}
