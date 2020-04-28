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
import PropTypes from 'prop-types';

import './ShippingLabel.style';

const BUTTON_NAME = 'Download Shipping Label';
const FILE_NAME = 'Shipping-Label';
const EMPTY_LABEL = 'none';

class ShippingLabel extends PureComponent {
    static propTypes = {
        ...this.propTypes,
        url: PropTypes.string.isRequired
    };

    render() {
        const { url } = this.props;
        if (url === EMPTY_LABEL) {
            return (
            <div block="RmaWidget">
                <a
                  block="Button"
                  href={ url }
                  download={ FILE_NAME }
                  disabled="true"
                >
                { BUTTON_NAME }
                </a>
            </div>
            );
        }

        return (
            <div block="RmaWidget">
                <a
                  block="Button"
                  href={ url }
                  download={ FILE_NAME }
                >
                { BUTTON_NAME }
                </a>
            </div>
        );
    }
}
export default ShippingLabel;
