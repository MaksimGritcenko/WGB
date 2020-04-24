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

const FILE_NAME = 'Shipping-Label';

class ShippingLabel extends PureComponent {
    static propTypes = {
        ...this.propTypes,
        url: PropTypes.string.isRequired
    };

    static defaultProps = {
        // eslint-disable-next-line react/default-props-match-prop-types
        label: 'Download Shipping Label'
    };

    componentDidUpdate() {

    }

    render() {
        const { label, url } = this.props;
        return (
        <div block="RmaWidget">
            <a
              block="Button"
              href={ url }
              download={ FILE_NAME }
            >
            { label }
            </a>
        </div>
        );
    }
}
export default ShippingLabel;
