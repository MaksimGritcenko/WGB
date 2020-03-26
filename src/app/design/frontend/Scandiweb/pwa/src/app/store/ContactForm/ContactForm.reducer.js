/**
 * @category  Netnutri
 * @author    Rihards Stasans <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

import { UPDATE_CONTACT_FORM } from './ContactForm.action';

export const initialState = {
    success: false,
    error: false
};

const ContactFormReducer = (state = initialState, action) => {
    const {
        type,
        data
    } = action;

    switch (type) {
    case UPDATE_CONTACT_FORM:
        return { ...state, ...data };

    default:
        return state;
    }
};

export default ContactFormReducer;
