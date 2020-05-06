import { Field } from 'Util/Query';

export class ProductReturnQuery {
    /**
     * RATINGS
     */
    giveRatingForRequest(input) {
        return new Field('giveRatingForRequest')
            .addArgument('input', 'RatingForRequestInput!', input)
            .addField('success');
    }

    /**
     * CHAT
     */
    sendMessage(input) {
        return new Field('sendRmaMessage')
            .addArgument('input', 'SendRmaMessageInput!', input)
            .addField('success');
    }

    /**
     * MY RETURN
     */
    getReturnList() {
        return new Field('getReturnList')
            .addField('created_at')
            .addField('order_id')
            .addField('increment_id')
            .addField('request_id')
            .addField('request_qty')
            .addField(this._getReturnStatusFields());
    }

    /**
     * NEW RETURN
     */
    getRmaConfiguration() {
        return new Field('getRmaConfiguration')
            .addField(this._getReturnReasonsFields())
            .addField(this._getReturnResolutionsFields())
            .addField(this._getItemConditionsFields())
            .addField(this._getItemCustomFieldsFields())
            .addField(this._getAdminContactDataFields())
            .addField('max_file_size');
    }

    getRmaPolicy() {
        return new Field('getRmaPolicy')
            .addField('policy_status')
            .addField('policy_page_url');
    }


    _getAdminContactDataFields() {
        return new Field('contact_data')
            .addField('email')
            .addField('phone_number');
    }

    getRmaPolicy() {
        return new Field('getRmaPolicy')
            .addField('policy_status')
            .addField('policy_page_url');
    }

    _getReturnReasonsFields() {
        return new Field('reasons')
            .addField('reason_id')
            .addField('title')
            .addField('payer');
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

    _getItemCustomFieldsFields() {
        return new Field('custom_fields')
            .addField(this._getItemCustomFieldFields())
            .addField('label');
    }

    _getItemCustomFieldFields() {
        return new Field('fields')
            .addField('code')
            .addField('label');
    }

    getNewReturnMutation(options) {
        return new Field('createReturnRequest')
            .addArgument('input', 'CreateReturnInput!', options)
            .addField('return_id');
    }

    /**
     * RETURN DETAILS
     */
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

    getConfigForDetails() {
        return new Field('getRmaConfiguration')
            .addField(this._getReturnCarrierFields())
            .addField('max_file_size')
            .addField('customer_feedback_enabled')
            .addField('chat_enabled');
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
            .addField(this._getReturnRatingField())
            .addField(this._getReturnItemFields())
            .addField('id')
            .addField('order_id')
            .addField('created_at')
            .addField('state')
            .addField('status_description');
    }

    _getReturnRatingField() {
        return new Field('rating')
            .addField('comment')
            .addField('stars');
    }

    getShippingLabel(returnId) {
        return new Field('getShippingLabel')
            .addArgument('return_id', 'Int!', returnId)
            .addField('file');
    }

    _getReturnTrackingFields() {
        return new Field('tracking')
            .addField('carrier')
            .addField('tracking_id')
            .addField('tracking_code')
            .addField('tracking_number');
    }

    _getChosenAttributesField() {
        return new Field('chosen_attributes')
            .addField('label')
            .addField('value');
    }

    _getReturnItemFields() {
        return new Field('items')
            .addField(this._getReturnProductFields())
            .addField(this._getReturnReasonFields('resolution'))
            .addField(this._getReturnReasonReasonFields())
            .addField(this._getReturnReasonFields('condition'))
            .addField(this._getReturnStatusFields())
            .addField(this._getChosenAttributesField())
            .addField('name')
            .addField('qty');
    }

    _getReturnStatusFields() {
        return new Field('status')
            .addField('state_label');
    }

    _getReturnReasonFields(id) {
        return new Field(id)
            .addField('title');
    }

    _getReturnReasonReasonFields() {
        return new Field('reason')
            .addField('title')
            .addField('payer');
    }

    _getReturnProductFields() {
        return new Field('product')
            .addField(this._getReturnProductImageFields('image'))
            .addField(this._getReturnProductImageFields('small_image'))
            .addField(this._getReturnProductImageFields('thumbnail'))
            .addField('name');
    }

    _getReturnProductImageFields(id) {
        return new Field(id)
            .addField('path')
            .addField('url')
            .addField('label');
    }

    getRmaChat(returnId) {
        return new Field('getRmaChatForRequest')
            .addArgument('request_id', 'String!', returnId)
            .addField(this._getRmaChatMessageFields());
    }

    _getRmaChatMessageFields() {
        return new Field('messages')
            .addField(this._getRmaFileFields())
            .addField('is_manager')
            .addField('is_system')
            .addField('message')
            .addField('username')
            .addField('created_at')
            .addField('message_id');
    }

    _getRmaFileFields() {
        return new Field('files')
            .addField('filename')
            .addField('link');
    }
}

export default new ProductReturnQuery();
