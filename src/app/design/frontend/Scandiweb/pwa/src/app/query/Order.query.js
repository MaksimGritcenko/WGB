import { OrderQuery as SourceOrderQuery } from 'SourceQuery/Order.query';

export class OrderQuery extends SourceOrderQuery {
    _getOrderProductsFields() {
        return [
            ...this._getDefaultFields(),
            ...this._prepareImageFields(),
            this._prepareAttributes(),
            'quote_item_id'
        ];
    }
}

export default new OrderQuery();
