/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import React from 'react';
import PropTypes from 'prop-types';
import FieldForm from 'Component/FieldForm';
import Loader from 'Component/Loader';
import './ContactForm.style';

export default class ContactForm extends FieldForm {
    state = {
        formKey: 0
    };

    static propTypes = {
        sendMessage: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        formSent: PropTypes.bool,
        message: PropTypes.string
    };

    static defaultProps = {
        isLoading: false,
        formSent: false,
        message: ''
    };

    /**
     * On submit
     *
     * @param fields
     */
    onFormSuccess = (fields) => {
        const { sendMessage } = this.props;
        sendMessage(fields);
    };

    /**
     * Fields map
     *
     * @return {{name: {label: *, validation: [string]}, surname: {label: *, validation: [string]}  telephone: {label: *, validation: [string]}, message: {label: *, type: string, validation: [string]}, email: {label: *, validation: [string]}}}
     */
    get fieldMap() {
        return {
            name: {
                validation: ['notEmpty'],
                placeholder: __('Name*')
            },
            surname: {
                validation: ['notEmpty'],
                placeholder: __('Surname*')
            },
            telephone: {
                validation: ['notEmpty'],
                placeholder: __('Phone number*')
            },
            email: {
                validation: ['notEmpty'],
                placeholder: __('E-mail*')
            },
            message: {
                type: 'textarea',
                validation: ['notEmpty'],
                placeholder: __('Your message*')
            }
        };
    }

    /**
     * Render actions
     *
     * @return {*}
     */
    renderActions() {
        const { isLoading } = this.props;

        return (
            <>
                <Loader isLoading={ isLoading } />
                <p block="ContactForm" elem="Accept">
                    By clicking the Send message button you accept the VGB terms
                </p>
                <button type="submit" block="ContactForm" elem="Button">
                    { __('Send message') }
                </button>
            </>
        );
    }

    /**
     * Render form
     *
     * @return {*}
     */
    render() {
        return (
            <div block="ContactForm" elem="Wrapper">
                { super.render() }
            </div>
        );
    }
}
