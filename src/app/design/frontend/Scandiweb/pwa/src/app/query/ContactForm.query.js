/**
 * @category  Netnutri
 * @author    Rihards Stasans <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

import { Field } from 'Util/Query';

export class ContactFormQuery {
    getSendContactFormMutation(options) {
        return new Field('contactForm')
            .addArgument('contact', 'ContactForm!', options)
            .addField('message');
    }
}

export default new ContactFormQuery();
