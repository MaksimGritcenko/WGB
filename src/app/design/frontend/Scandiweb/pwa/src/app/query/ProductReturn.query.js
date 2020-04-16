import { Field } from 'Util/Query';

export class ProductReturnQuery {
    // getQuery() {
    //     return new Field('productReturn')
    //         .addField(this._getgetReturnReasonsFields())
    //         .addField(this._getReturnResolutionsFields())
    //         .addField(this._getItemConditionsFields());
    // }

    getgetReturnReasonsFields() {
        return new Field('getReturnReasons')
            .addField('id')
            .addField('title');
    }

    getReturnResolutionsFields() {
        return new Field('getReturnResolutions')
            .addField('id')
            .addField('title');
    }

    getItemConditionsFields() {
        return new Field('getItemConditions')
            .addField('id')
            .addField('title');
    }
}

export default new ProductReturnQuery();
