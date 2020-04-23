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

import { getReturnList, setLoading } from 'Store/Return';
import { fetchQuery } from 'Util/Request';
import { showNotification } from 'Store/Notification';
import { ProductReturnQuery } from 'Query';

export class ReturnDispatcher {
    requestReturns(dispatch) {
        const query = ProductReturnQuery.getReturnList();
        dispatch(setLoading(true));

        return fetchQuery(query).then(
            ({ getReturnList: orders }) => {
                dispatch(setLoading(false));
                dispatch(getReturnList(orders, false));
            },
            (error) => {
                dispatch(setLoading(false));
                dispatch(showNotification('error', error[0].message));
            }
        );
    }
}

export default new ReturnDispatcher();
