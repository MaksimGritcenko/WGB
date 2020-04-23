import { OrderQuery as SourceOrderQuery } from 'SourceQuery/Order.query';
import { Field } from 'Util/Query';

export class OrderQuery extends SourceOrderQuery {
    _getOrderProductsFields() {
        return [
            ...this._getDefaultFields(),
            ...this._prepareImageFields(),
            this._prepareAttributes(),
            'quote_item_id',
            'qty_returning',
            this._getReturnResolutions()
        ];
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
export default new OrderQuery();
