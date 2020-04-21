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

    // ---------------------- //
    // NEW return
    // ---------------------- //

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

    // ---------------------- //
    // Return Details
    // ---------------------- //

    getReturnTrackingInfo(input) {
        return new Field('addTrackingToRequest')
            .addArgument('input', 'AddTrackingInput!', input)
            .addField('success');
    }

    getCancelReturnRequest(input) {
        return new Field('cancelReturnRequest')
            .addArgument('input', 'CancelRequestInput!', input)
            .addField('success');
    }

    getReturnCarriers() {
        return new Field('getRmaConfiguration')
            .addField(this._getReturnCarrierFields());
    }

    _getReturnCarrierFields() {
        return new Field('carriers')
            .addField('code')
            .addField('label');
    }

    getReturnDetails(returnId) {
        return new Field('getReturnDetailsById')
            .addArgument('return_id', 'Int!', returnId)
            .addField(this._getReturnTrackingFields())
            .addField(this._getReturnItemFields())
            .addField('id')
            .addField('order_id')
            .addField('created_at')
            .addField('status');
    }

    _getReturnTrackingFields() {
        return new Field('tracking')
            .addField('carrier')
            .addField('tracking_id')
            .addField('tracking_code')
            .addField('tracking_number');
    }

    _getReturnItemFields() {
        return new Field('items')
            // .addField('discount_amount')
            // .addField('discount_percent')
            // .addField('item_id')
            // .addField('price')
            .addField(this._getReturnProductFields())
            .addField('qty')
            // .addField('row_total')
            // .addField('sku')
            // .addField('tax_amount')
            // .addField('tax_percent')
            .addField(this._getReturnReasonFields('resolution'))
            .addField(this._getReturnReasonFields('reason'))
            .addField(this._getReturnReasonFields('condition'))
            .addField('status');
    }

    _getReturnReasonFields(id) {
        return new Field(id)
            .addField('title');
    }

    _getReturnProductFields() {
        return new Field('product')
            .addField(this._getReturnProductImageFields('image'))
            .addField(this._getReturnProductImageFields('small_image'))
            .addField(this._getReturnProductImageFields('thumbnail'))
            .addField('name');
            // .addField('attributes');
    }

    _getReturnProductImageFields(id) {
        return new Field(id)
            .addField('path')
            .addField('url')
            .addField('label');
    }
}

export default new ProductReturnQuery();
