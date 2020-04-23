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
import Event, { EVENT_GTM_CHECKOUT_OPTION } from 'Util/Event';

import {
    CheckoutPaymentsContainer as SourceCheckoutPaymentsContainer,
    mapDispatchToProps
} from 'SourceComponent/CheckoutPayments/CheckoutPayments.container';

export const EVENT_TIMEOUT_ON_LOAD = 1000;
export { mapDispatchToProps };

export class CheckoutPaymentsContainer extends SourceCheckoutPaymentsContainer {
    componentDidMount() {
        super.componentDidMount();
        const { selectedPaymentCode } = this.state;

        setTimeout(() => Event.dispatch(
            EVENT_GTM_CHECKOUT_OPTION,
            { step: 2, option: selectedPaymentCode }
        ), EVENT_TIMEOUT_ON_LOAD);
    }

    selectPaymentMethod({ code }) {
        super.selectPaymentMethod({ code });

        Event.dispatch(
            EVENT_GTM_CHECKOUT_OPTION,
            { step: 2, option: code }
        );
    }
}

export default connect(null, mapDispatchToProps)(CheckoutPaymentsContainer);
