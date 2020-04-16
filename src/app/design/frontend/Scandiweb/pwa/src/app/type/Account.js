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
export const NEW_RETURN = 'new-return';

export const activeTabType = PropTypes.oneOf([
    DASHBOARD,
    MY_ORDERS,
    MY_WISHLIST,
    ADDRESS_BOOK,
    NEWSLETTER_SUBSCRIPTION,
    MY_RETURNS
]);
