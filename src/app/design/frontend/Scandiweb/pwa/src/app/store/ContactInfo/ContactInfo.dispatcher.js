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

import { QueryDispatcher } from 'Util/Request';
import { CmsBlockQuery } from 'Query';
import { showNotification } from 'Store/Notification';
import { updateCmsBlocks } from 'Store/CmsBlocksAndSlider';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';

export class ContactInfoDispatcher extends QueryDispatcher {
    constructor() {
        super('ContactInfo', ONE_MONTH_IN_SECONDS);
    }

    onSuccess(options, dispatch) {
        if (options) {
            const { cmsBlocks } = options;
            dispatch(updateCmsBlocks(cmsBlocks));
        }
    }

    onError(error, dispatch) {
        dispatch(showNotification('error', 'Error fetching Header or Footer!', error));
    }

    prepareRequest(options) {
        return [
            CmsBlockQuery.getQuery(options)
        ];
    }
}

export default new ContactInfoDispatcher();
