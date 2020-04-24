import { Field } from 'Util/Query';
import { ProductListQuery } from 'Query';
import { CartQuery as SourceCartQuery } from 'SourceQuery/Cart.query';

export class CartQuery extends SourceCartQuery {
    _getCartTotalsFields() {
        return [
            'subtotal',
            'subtotal_incl_tax',
            'items_qty',
            'tax_amount',
            'grand_total',
            'discount_amount',
            'quote_currency_code',
            'subtotal_with_discount',
            'coupon_code',
            'shipping_amount',
            'is_virtual',
            'is_show_rma_info_cart',
            this._getCartItemsField()
        ];
    }

    _getProductField() {
        ProductListQuery.options.isForLinkedProducts = true;

        const productQuery = new Field('product')
            .addFieldList([
                ...ProductListQuery._getProductInterfaceFields(false, true),
                this._getProductCategoryFields(),
                'stock_status',
                this._getReturnResolutions()
            ]);

        ProductListQuery.options.isForLinkedProducts = false;

        return productQuery;
    }

    _getProductCategoryFields() {
        return new Field('categories')
            .addField('url_path');
    }

    _getReturnResolutions() {
        return new Field('return_resolutions')
            .addField(this._getResolution())
            .addField('value');
    }

    _getResolution() {
        return new Field('resolution')
            .addField('resolution_id')
            .addField('title')
            .addField('position')
            .addField('label');
    }
}

export default new CartQuery();
