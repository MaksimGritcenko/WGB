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
import { fetchQuery, fetchMutation } from 'Util/Request';
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

    sendMessage(requestId, messageText = '', messageFiles = [], dispatch) {
        const mutation = ProductReturnQuery.sendMessage({
            request_id: requestId,
            message_text: messageText,
            encoded_files: messageFiles
        });

        return fetchMutation(mutation);
    }

    updateMessageList(requestId, dispatch) {
        // TODO implement
    }
}

export default new ReturnDispatcher();
