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

import {
    DASHBOARD,
    MY_ORDERS,
    MY_WISHLIST,
    ADDRESS_BOOK,
    NEWSLETTER_SUBSCRIPTION
} from 'SourceType/Account';

export {
    regionType,
    addressType,
    addressesType,
    customerType,
    baseOrderInfoType,
    orderType,
    ordersType,
    tabType,
    tabMapType
} from 'SourceType/Account';

export {
    DASHBOARD,
    MY_ORDERS,
    MY_WISHLIST,
    ADDRESS_BOOK,
    NEWSLETTER_SUBSCRIPTION
};

export const MY_RETURNS = 'my-returns';

export const activeTabType = PropTypes.oneOf([
    DASHBOARD,
    MY_ORDERS,
    MY_WISHLIST,
    ADDRESS_BOOK,
    NEWSLETTER_SUBSCRIPTION,
    MY_RETURNS
]);
