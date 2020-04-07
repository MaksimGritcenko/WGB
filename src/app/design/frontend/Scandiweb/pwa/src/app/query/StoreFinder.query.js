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

import { Field } from 'Util/Query';

/**
 * Store Finder Query
 * @class StoreFinderQuery
 */
class StoreFinderQuery {
    /**
     * get Stores query
     * @return {Query} Store finder query
     * @memberof StoreFinderQuery
     */
    getQuery() {
        return new Field('getStores')
            .addFieldList([
                'store_name',
                'address',
                'city',
                'phone_number',
                'latitude',
                'longitude',
                'store_hours',
                'working_days'
            ]);
    }
}

export default new StoreFinderQuery();
