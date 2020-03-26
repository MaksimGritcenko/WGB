/**
 * @category  Netnutri
 * @author    Rihards Stasans <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
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
     * @return {{name: {label: *, validation: [string]}, telephone: {label: *, validation: [string]}, message: {label: *, type: string, validation: [string]}, email: {label: *, validation: [string]}}}
     */
    get fieldMap() {
        return {
            name: {
                label: __('Full name'),
                validation: ['notEmpty']
            },
            telephone: {
                label: __('Phone number'),
                validation: ['notEmpty']
            },
            email: {
                label: __('Email'),
                validation: ['notEmpty']
            },
            message: {
                type: 'textarea',
                label: __('Message'),
                validation: ['notEmpty']
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
                <button type="submit" block="Button">
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
        const { message, formSent } = this.props;

        if (formSent) {
            return (
                <div block="ContactForm" elem="Wrapper">
                    <h2 block="ContactForm" elem="Header">{ __('Thank you for your message!') }</h2>
                    <p block="ContactForm" elem="Message">{ message }</p>
                </div>
            );
        }

        return (
            <div block="ContactForm" elem="Wrapper">
                { super.render() }
            </div>
        );
    }
}
