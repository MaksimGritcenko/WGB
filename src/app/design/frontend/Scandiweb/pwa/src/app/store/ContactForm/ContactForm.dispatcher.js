/**
 * @category  Netnutri
 * @author    Rihards Stasans <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

import { fetchMutation } from 'Util/Request';
import { ContactFormQuery } from 'Query';
import { showNotification } from 'Store/Notification';
import { updateContactForm } from './ContactForm.action';

/**
 * ContactForm Dispatcher
 * @class ContactFormDispatcher
 * @extends QueryDispatcher
 */
export class ContactFormDispatcher {
    prepareRequest(options, dispatch) {
        dispatch(updateContactForm({
            isLoading: true,
            success: false,
            error: false,
            formSent: false
        }));

        return fetchMutation(
            ContactFormQuery.getSendContactFormMutation(options)
        )
            .then(
                (data) => {
                    dispatch(showNotification('success', data.contactForm.message));
                    dispatch(updateContactForm({
                        success: true,
                        isLoading: false,
                        formSent: true,
                        message: data.contactForm.message
                    }));
                },
                (error) => {
                    dispatch(showNotification('error', error[0].message));
                    dispatch(updateContactForm({
                        error: true,
                        isLoading: false
                    }));
                }
            );
    }
}

export default new ContactFormDispatcher();
