import { OrderQuery as SourceOrderQuery } from 'SourceQuery/Order.query';
import { Field } from 'Util/Query';

export class OrderQuery extends SourceOrderQuery {
    _getChosenAttributesField() {
        return new Field('chosen_attributes')
            .addField('label')
            .addField('value');
    }

    _getBaseOrderInfoFields(isList) {
        return [
            'id',
            'increment_id',
            'created_at',
            'status_label',
            'status_can_be_returned',
            'grand_total',
            ...(isList ? [] : ['sub_total'])
        ];
    }

    _getOrderProductsFields() {
        return [
            ...this._getDefaultFields(),
            ...this._prepareImageFields(),
            this._prepareAttributes(),
            this._getChosenAttributesField(),
            'quote_item_id',
            'qty_available_to_return',
            this._getOrderReturnability()
        ];
    }

    _getOrderReturnability() {
        return new Field('returnability')
            .addField('is_returnable')
            .addField('no_returnable_reason_label')
            .addField(this._getReturnResolutions());
    }

    _getReturnResolutions() {
        return new Field('resolutions')
            .addField('resolution_id')
            .addField('title')
            .addField('position')
            .addField('label');
    }
}
export default new OrderQuery();
