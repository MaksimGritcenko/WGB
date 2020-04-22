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
import { orderType } from 'Type/Account';
import MyAccountReturnTableRow from './MyAccountReturnTableRow.component';

export class MyAccountReturnTableRowContainer extends PureComponent {
    static propTypes = {
        currency_code: PropTypes.string,
        row: orderType.isRequired,
        onClick: PropTypes.func
    };

    static defaultProps = {
        currency_code: '',
        onClick: () => {}
    };

    containerFunctions = {
        onViewClick: this.onViewClick.bind(this)
    };

    onViewClick() {
        const { row, onClick } = this.props;

        onClick(row);
    }

    containerProps = () => {
        const { row, currency_code } = this.props;
        return { row, currency_code };
    };

    render() {
        return (
            <MyAccountReturnTableRow
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default MyAccountReturnTableRowContainer;
