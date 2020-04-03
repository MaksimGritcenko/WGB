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

import BrowserDatabase from 'Util/BrowserDatabase';
import {
    filterStoreConfig
} from 'SourceStore/Config/Config.reducer';
import { UPDATE_CONFIG } from './Config.action';

export {
    MAX_WIDTH,
    MAX_HEIGHT
} from 'SourceStore/Config/Config.reducer';

export { filterStoreConfig };

const {
    countries,
    reviewRatings,
    storeConfig,
    gtm
} = BrowserDatabase.getItem('config') || {
    countries: [],
    reviewRatings: [],
    storeConfig: {},
    gtm: {}
};

export const initialState = {
    ...filterStoreConfig(storeConfig),
    gtm,
    countries,
    reviewRatings,
    isLoading: true
};

const ConfigReducer = (state = initialState, action) => {
    const {
        config: {
            gtm,
            countries,
            reviewRatings,
            checkoutAgreements,
            storeConfig = {}
        } = {}, type
    } = action;

    switch (type) {
    case UPDATE_CONFIG:
        const filteredStoreConfig = filterStoreConfig(storeConfig);
        const {
            header_logo_src,
            terms_are_enabled = false,
            pagination_frame,
            pagination_frame_skip,
            anchor_text_for_previous,
            anchor_text_for_next
        } = filteredStoreConfig;

        return {
            ...state,
            gtm,
            countries,
            reviewRatings,
            checkoutAgreements,
            ...filteredStoreConfig,
            // Should be updated manually as filteredStoreConfig does not contain header_logo_src when it is null
            // and header_logo_src takes old value
            header_logo_src,
            terms_are_enabled,
            pagination_frame,
            pagination_frame_skip,
            anchor_text_for_previous,
            anchor_text_for_next,
            isLoading: false
        };

    default:
        return state;
    }
};

export default ConfigReducer;
