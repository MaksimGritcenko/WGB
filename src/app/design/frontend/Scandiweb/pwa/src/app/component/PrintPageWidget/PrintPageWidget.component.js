/* eslint-disable no-magic-numbers */
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
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import isMobile from 'Util/Mobile';

const BUTTON_NAME = 'Print Packing Slip';

export default class PrintPageWidget extends PureComponent {
    static defaultProps = {
        label: 'Print Packing Slip'
    };

    print = () => {
        // eslint-disable-next-line max-len
        const customer_address = document.getElementsByClassName('MyAccountReturnDetails-CustomerAndAddressBlocks')[0].innerHTML;
        const items = document.getElementsByClassName('MyAccountReturnDetailsItems')[0].innerHTML;
        const ORDER_HTML = `${ customer_address }${ items }`;
        const ORIGINAL_PAGE = document.body.innerHTML;
        document.body.innerHTML = ORDER_HTML;
        window.print();
        document.body.innerHTML = ORIGINAL_PAGE;
        location.reload();
    };

    printMobile = () => {
        // eslint-disable-next-line max-len
        const customer_address = document.getElementsByClassName('MyAccountReturnDetails-CustomerAndAddressBlocks')[0].innerHTML;
        const items = document.getElementsByClassName('MyAccountReturnDetailsItems')[0].innerHTML;
        const ORDER_HTML = `${ customer_address }${ items }`;
        const ORIGINAL_PAGE = document.body.innerHTML;
        document.body.innerHTML = ORDER_HTML;
        setTimeout(() => {
            window.print();
            setTimeout(() => {
                document.body.innerHTML = ORIGINAL_PAGE;
                location.reload();
            }, 2000);
        }, 100);
    };

    printMobileIOS = () => {
        // eslint-disable-next-line max-le
        // eslint-disable-next-line max-len
        const customer_address = document.getElementsByClassName('MyAccountReturnDetails-CustomerAndAddressBlocks')[0].innerHTML;
        const items = document.getElementsByClassName('MyAccountReturnDetailsItems')[0].innerHTML;
        const ORDER_HTML = `${ customer_address }${ items }`;
        const ORIGINAL_PAGE = document.body.innerHTML;
        document.body.innerHTML = ORDER_HTML;
        setTimeout(() => {
            document.execCommand('print', false, null);
            if (navigator.userAgent.match('CriOS')) {
                window.print();
            }
            setTimeout(() => {
                document.body.innerHTML = ORIGINAL_PAGE;
                location.reload();
            }, 4000);
        }, 100);
    };

    render() {
        if (isMobile.iOS()) {
            return (
            <div block="RmaWidget">
                <button
                  block="Button"
                  onClick={ () => this.printMobileIOS() }
                >
                { BUTTON_NAME }
                </button>
            </div>
            );
        }

        if (isMobile.android()) {
            return (
            <div block="RmaWidget">
                <button
                  block="Button"
                  onClick={ () => this.printMobile() }
                >
                    { BUTTON_NAME }
                </button>
            </div>
            );
        }

        return (
            <div block="RmaWidget">
                <button
                  block="Button"
                  onClick={ () => this.print() }
                >
                    { BUTTON_NAME }
                </button>
            </div>
        );
    }
}
