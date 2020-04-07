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

import {
    UPDATE_STORE_FINDER
} from './StoreFinder.action';

const initialState = {
    storeListCities: [],
    storeListMapped: {},
    storeByName: {},
    storeList: [],
    isLoading: true
};

const StoreFinderReducer = (state = initialState, action) => {
    const { storeList, type } = action;

    switch (type) {
    case UPDATE_STORE_FINDER:
        const storeListObject = storeList.reduce((cities, store) => {
            const {
                city, longitude, latitude, store_name
            } = store;

            if (city && longitude && latitude) {
                if (!cities.storeListCities.includes(city)) {
                    cities.storeListCities.push(city);
                }

                if (!cities.storeListMapped[city]) {
                    // eslint-disable-next-line no-param-reassign
                    cities.storeListMapped[city] = [];
                }

                cities.storeListMapped[city].push(store);

                // eslint-disable-next-line no-param-reassign
                cities.storeByName[store_name] = store;
            }

            return cities;
        }, { storeListCities: [], storeListMapped: {}, storeByName: {} });

        return {
            ...state,
            ...storeListObject,
            storeList
        };

    default:
        return state;
    }
};

export default StoreFinderReducer;
