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
import { PureComponent } from 'react';
import './PrintPageWidget.style';

const BUTTON_NAME = 'Print Packing Slip';

export default class PrintPageWidget extends PureComponent {
    print = () => {
        try {
            document.execCommand('print', false, null);
        } catch {
            window.print();
        }
    };

    render() {
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
