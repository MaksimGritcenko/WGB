import { formatCurrency, roundPrice } from 'Util/Price';

import SourceCartItemPrice from 'SourceComponent/CartItemPrice/CartItemPrice.component';

class CartItemPrice extends SourceCartItemPrice {
    render() {
        const { row_total, currency_code, mix } = this.props;
        const price = roundPrice(row_total);

        return (
            <p block="ProductPrice" aria-label={ __('Product Price') } mix={ mix }>
                <span aria-label={ __('Current product price') }>
                    <data value={ price }>{ `${ price } ${ formatCurrency(currency_code) }` }</data>
                </span>
            </p>
        );
    }
}

export default CartItemPrice;
