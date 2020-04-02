import { Field } from 'Util/Query';
import { ProductListQuery } from 'Query';
import { CartQuery as SourceCartQuery } from 'SourceQuery/Cart.query';

export class CartQuery extends SourceCartQuery {
    _getProductField() {
        ProductListQuery.options.isForLinkedProducts = true;

        const productQuery = new Field('product')
            .addFieldList([
                ...ProductListQuery._getProductInterfaceFields(false, true),
                this._getProductCategoryFields(),
                'stock_status'
            ]);

        ProductListQuery.options.isForLinkedProducts = false;

        return productQuery;
    }


    _getProductCategoryFields() {
        return new Field('categories')
            .addField('url_path');
    }
}

export default new CartQuery();
