import { Field } from 'Util/Query';

export class ProductReturnQuery {
    // My Return

    getReturnList() {
        return new Field('getReturnList')
            .addField('created_at')
            .addField('order_id')
            .addField('request_id')
            .addField('request_qty')
            .addField('status_id')
            .addField('status_label');
    }

    // NEW return

    getRmaConfiguration() {
        return new Field('getRmaConfiguration')
            .addField(this._getReturnReasonsFields())
            .addField(this._getReturnResolutionsFields())
            .addField(this._getItemConditionsFields());
    }

    _getReturnReasonsFields() {
        return new Field('reasons')
            .addField('reason_id')
            .addField('title');
    }

    _getReturnResolutionsFields() {
        return new Field('resolutions')
            .addField('resolution_id')
            .addField('title');
    }

    _getItemConditionsFields() {
        return new Field('conditions')
            .addField('condition_id')
            .addField('title');
    }

    getNewReturnMutation(options) {
        return new Field('createReturnRequest')
            .addArgument('input', 'CreateReturnInput!', options)
            .addField('return_id');
    }

    // Return Details

    getReturnCarriers() {
        return new Field('returnCarriers')
            .addField('id')
            .addField('title');
    }
}

export default new ProductReturnQuery();
