import Overlay from 'Component/Overlay';
import Link from 'Component/Link';
import CartItem from 'Component/CartItem';
import { formatCurrency } from 'Util/Price';

import SourceCartOverlay from 'SourceComponent/CartOverlay/CartOverlay.component';
import './CartOverlay.style';

export default class CartOverlay extends SourceCartOverlay {
    renderActions() {
        const { totals: { items }, guest_checkout } = this.props;

        const options = !items || items.length < 1
            ? {
                onClick: e => e.preventDefault(),
                disabled: true
            }
            : {};

        const destination = guest_checkout ? '/checkout' : '/signin';

        return (
            <div block="CartOverlay" elem="Actions">
                <Link
                  block="CartOverlay"
                  elem="CartButton"
                  mix={ { block: 'Button', mods: { isHollow: true } } }
                  to="/cart"
                >
                    { __('View cart') }
                </Link>
                <Link
                  block="CartOverlay"
                  elem="CheckoutButton"
                  mix={ { block: 'Button' } }
                  to={ destination }
                  { ...options }
                >
                    <span />
                    { __('Secure checkout') }
                </Link>
            </div>
        );
    }

    renderPriceLine(price) {
        const { totals: { quote_currency_code } } = this.props;

        return `${ parseFloat(price).toFixed(2) } ${ formatCurrency(quote_currency_code) }`;
    }

    renderCartItems() {
        const { totals: { items, quote_currency_code } } = this.props;

        if (!items || items.length < 1) return this.renderNoCartItems();

        return (
            <ul block="CartOverlay" elem="Items" aria-label="List of items in cart">
                { items.map(item => (
                    <CartItem
                      key={ item.item_id }
                      item={ item }
                      currency_code={ quote_currency_code }
                    />
                )) }
            </ul>
        );
    }

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
