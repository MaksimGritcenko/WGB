/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-tdeme
 * @link https://gitdub.com/scandipwa/base-tdeme
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { getFormattedDate } from 'Store/Order/Order.reducer';
import './MyAccountReturnTableRow.style';

class MyAccountOrderTableRow extends PureComponent {
    static propTypes = {
        onViewClick: PropTypes.func.isRequired,
        row: PropTypes.object.isRequired
    };

    render() {
        const {
            row: {
                order_id,
                request_id,
                created_at,
                status_label,
                request_qty
            },
            onViewClick
        } = this.props;

        return (
            <tr onClick={ onViewClick } block="MyAccountReturnTableRow">
                <td>{ order_id ? `#${order_id}` : '' }</td>
                <td block="hidden-mobile">{ request_qty }</td>
                <td block="hidden-mobile">{ request_id }</td>
                <td>{ getFormattedDate(created_at) }</td>
                <td>{ status_label }</td>
            </tr>
        );
    }
}

export default MyAccountOrderTableRow;
