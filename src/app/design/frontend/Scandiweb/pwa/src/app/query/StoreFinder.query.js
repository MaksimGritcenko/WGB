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
                'store_hours',
                'working_days',
                'image_1',
                'image_2',
                'image_3'
            ])
            .setAlias('StoreInfo');
    }

    getStoresList() {
        return new Field('getStores')
            .addField('city')
            .addField('city_external_id')
            .addField('store_name')
            .addField('store_external_id')
            .addField('address')
            .addField('store_hours')
            .addField('phone_number')
            .addField('manager_email')
            .addField('code1c');
    }
}

export default new StoreFinderQuery();
