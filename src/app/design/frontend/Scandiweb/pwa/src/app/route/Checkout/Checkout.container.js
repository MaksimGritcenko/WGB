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

import { CART_TAB } from 'Component/NavigationTabs/NavigationTabs.component';
import Event, { EVENT_GTM_CHECKOUT, EVENT_GTM_PURCHASE } from 'Util/Event';
import BrowserDatabase from 'Util/BrowserDatabase';
import { GUEST_QUOTE_ID } from 'Store/Cart';
import { isSignedIn } from 'Util/Auth';

import {
    CheckoutContainer as SourceCheckoutContainer,
    PAYMENT_TOTALS,
    mapStateToProps,
    mapDispatchToProps
} from 'SourceRoute/Checkout/Checkout.container';

import { BILLING_STEP, DETAILS_STEP } from './Checkout.component';

export {
    STRIPE_AUTH_REQUIRED
} from 'SourceRoute/Checkout/Checkout.container';

export {
    mapStateToProps,
    mapDispatchToProps
};

export const CHECKOUT_EVENT_DELAY = 500;

export class CheckoutContainer extends SourceCheckoutContainer {
    componentDidMount() {
        super.componentDidMount();

        const { totals = {} } = this.props;
        setTimeout(
            () => Event.dispatch(EVENT_GTM_CHECKOUT, { totals, step: 1 }),
            CHECKOUT_EVENT_DELAY
        );
    }

    componentDidUpdate(_, prevState) {
        const { customer: { addresses } } = this.props;
        const { shippingMethods } = this.state;

        if (isSignedIn()
            && (addresses && addresses.length === 0)
            && shippingMethods.length) {
            this.resetShippingMethods();
        }

        const { checkoutStep, isLoading } = this.state;
        const { checkoutStep: prevCheckoutStep } = prevState;

        if (!isLoading && checkoutStep !== prevCheckoutStep) {
            const { totals } = this.props;
            if (checkoutStep === BILLING_STEP) {
                Event.dispatch(EVENT_GTM_CHECKOUT, { totals, step: 2 });
            } else {
                Event.dispatch(EVENT_GTM_CHECKOUT, { totals, step: 3 });
            }
        }
    }

    setDetailsStep(orderID) {
        const {
            resetCart,
            setNavigationState,
            totals: { items = [] }
        } = this.props;

        // For some reason not logged in user cart preserves qty in it
        if (!isSignedIn()) {
            BrowserDatabase.deleteItem(GUEST_QUOTE_ID);
        }

        const { paymentTotals: totals } = this.state;

        Event.dispatch(
            EVENT_GTM_PURCHASE,
            { orderID, totals: { ...totals, items } }
        );

        BrowserDatabase.deleteItem(PAYMENT_TOTALS);
        resetCart();

        this.setState({
            isLoading: false,
            paymentTotals: {},
            checkoutStep: DETAILS_STEP,
            orderID
        });

        setNavigationState({
            name: CART_TAB
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);
