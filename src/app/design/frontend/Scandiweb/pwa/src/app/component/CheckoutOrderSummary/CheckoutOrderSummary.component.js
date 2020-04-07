import CartItem from 'Component/CartItem';
import SourceCheckoutOrderSummary from 'SourceComponent/CheckoutOrderSummary/CheckoutOrderSummary.component';
import { formatCurrency, roundPrice } from 'Util/Price';
import './CheckoutOrderSummary.style.override';

export default class CheckoutOrderSummary extends SourceCheckoutOrderSummary {
    renderHeading() {
        const { totals: { items_qty } } = this.props;

        return (
            <h3
              block="CheckoutOrderSummary"
              elem="Header"
              mix={ { block: 'CheckoutPage', elem: 'Heading', mods: { hasDivider: true } } }
            >
                <span
                  block="CheckoutOrderSummary"
                  elem="OrderSummary"
                >
                    { __('Order Summary') }
                </span>
                <p block="CheckoutOrderSummary" elem="ItemsInCart">{ __('%s Item(s) in cart', items_qty) }</p>
            </h3>
        );
    }

    renderItem = (item) => {
        const {
            totals: {
                quote_currency_code
            }
        } = this.props;

        const { item_id } = item;

        return (
            <CartItem
              key={ item_id }
              item={ item }
              currency_code={ quote_currency_code }
              isNotEditing
            />
        );
    };

    renderPriceLine(price, name, mods) {
        if (!price) return null;

        const { totals: { quote_currency_code } } = this.props;
        const priceString = formatCurrency(quote_currency_code);

        return (
            <li block="CheckoutOrderSummary" elem="SummaryItem" mods={ mods }>
                <span block="CheckoutOrderSummary" elem="Text">
                    { name }
                </span>
                <span block="CheckoutOrderSummary" elem="Price">
                    { `${ roundPrice(price) } ${ priceString }` }
                </span>
            </li>
        );
    }
}
