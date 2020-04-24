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

export default class PrintPageWidget extends PureComponent {
    static propTypes = {
        label: PropTypes.string
    };

    static defaultProps = {
        label: 'Print Packing Slip'
    };

    print = () => {
        const printableElements = document.getElementsByClassName('MyAccount-TabContent')[0].innerHTML;
        const ORDER_HTML = `<html><head><title></title></head><body>${ printableElements }</body></html>`;
        const ORIGINAL_PAGE = document.body.innerHTML;
        document.body.innerHTML = ORDER_HTML;
        window.print();
        document.body.innerHTML = ORIGINAL_PAGE;
        location.reload();
    };

    render() {
        const { label } = this.props;
        return (
            <div block="RmaWidget">
                <button
                  block="Button"
                  onClick={ () => this.print() }
                >
                    { label }
                </button>
            </div>
        );
    }
}
