/**
 * @category  Netnutri
 * @author    Rihards Stasans <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ContactFormDispatcher } from 'Store/ContactForm';

import ContactForm from './ContactForm.component';

export const mapStateToProps = state => ({
    isLoading: state.ContactFormReducer.isLoading,
    formSent: state.ContactFormReducer.formSent,
    message: state.ContactFormReducer.message
});

export const mapDispatchToProps = dispatch => ({
    sendMessage: data => ContactFormDispatcher.prepareRequest(data, dispatch)
});

class ContactFormContainer extends PureComponent {
    render() {
        return (
            <ContactForm
              { ...this.props }
              { ...this.containerFunctions }
            />
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ContactFormContainer);
