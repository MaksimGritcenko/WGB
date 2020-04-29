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
        const ORDER_HTML = `<html><head><title></title></head><body>${ customer_address }${ items }</body></html>`;
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
        const ORDER_HTML = `<html><head><title></title></head><body>${ customer_address }${ items }</body></html>`;
        document.body.innerHTML = ORDER_HTML;
        setTimeout(() => {
            window.print();
            setTimeout(() => {
                document.body.innerHTML = ORDER_HTML;
                location.reload();
            }, 2000);
        }, 100);
    };

    render() {
        if (isMobile.any()) {
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
