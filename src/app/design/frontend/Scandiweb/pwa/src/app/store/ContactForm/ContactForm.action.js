/**
 * @category  Netnutri
 * @author    Rihards Stasans <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

export const UPDATE_CONTACT_FORM = 'UPDATE_CONTACT_FORM';

/**
 * Send message
 * @param {Object} data
 */
export const updateContactForm = (data = {}) => ({
    type: UPDATE_CONTACT_FORM,
    data
});
