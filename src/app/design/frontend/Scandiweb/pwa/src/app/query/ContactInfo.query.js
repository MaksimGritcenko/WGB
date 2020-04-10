import { Field } from 'Util/Query';

export class ContactInfo {
    getContactInfoQuery() {
        return new Field('getContactInfo')
            .addFieldList(this._getContactStoreFields())
            .setAlias('ContactInfo');
    }

    _getContactStoreFields() {
        return [
            'store_phone',
            'store_email',
            'store_working_hours'
        ];
    }
}

export default new ContactInfo();
