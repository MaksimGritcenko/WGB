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
import { StoreFinderQuery } from 'Query';
import { updateNoMatch } from 'Store/NoMatch';
import { updateStoreFinder } from 'Store/StoreFinder';
/**
 * Store Finder Dispatcher
 * @class StoreFinderDispatcher
 * @extends QueryDispatcher
 */
class StoreFinderDispatcher extends QueryDispatcher {
    constructor() {
        super('StoreFinder', 604800);
    }

    onSuccess({ getStores }, dispatch) {
        dispatch(updateStoreFinder(getStores));
    }

    onError(error, dispatch) {
        dispatch(updateNoMatch(true));
    }

    /**
     * Prepare Store Finder query
     * @param {{store_name: String, address: String, city: String, latitude: String, longitude: String, store_hours: String}} options A object containing different aspects of query
     * @return {Query} Store Finder query
     * @memberof StoreFinderDispatcher
     */
    prepareRequest() {
        return StoreFinderQuery.getQuery();
    }
}

export default new StoreFinderDispatcher();
