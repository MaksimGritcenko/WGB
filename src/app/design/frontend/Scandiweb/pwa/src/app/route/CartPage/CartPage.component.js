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

import Link from 'Component/Link';
import './CartPage.style';

import SourceCartPage from 'SourceRoute/CartPage/CartPage.component';

export default class CartPage extends SourceCartPage {
    renderTotals() {
        const {
            totals: {
                subtotal_incl_tax = 0,
                items
            },
            guest_checkout
        } = this.props;

        const props = !items || items.length < 1
            ? {
                onClick: e => e.preventDefault(),
                disabled: true
            }
            : {};

        const destination = guest_checkout ? '/checkout' : '/signin';

        return (
            <article block="CartPage" elem="Summary">
                <h4 block="CartPage" elem="SummaryHeading">{ __('Summary') }</h4>
                { this.renderTotalDetails() }
                <dl block="CartPage" elem="Total" aria-label="Complete order total">
                    <dt>{ __('Order total:') }</dt>
                    <dd>{ this.renderPriceLine(subtotal_incl_tax) }</dd>
                </dl>
                <div block="CartPage" elem="CheckoutButtons">
                    <Link
                      block="CartPage"
                      elem="CheckoutButton"
                      mix={ { block: 'Button' } }
                      to={ destination }
                      { ...props }
                    >
                        <span />
                        { __('Secure checkout') }
                    </Link>
                    <Link
                      block="CartPage"
                      elem="ContinueShopping"
                      to="/"
                    >
                        { __('Continue shopping') }
                    </Link>
                </div>
            </article>
        );
    }
}
