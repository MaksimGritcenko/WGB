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
    UPSELL,
    RELATED,
    CROSS_SELL
} from 'SourceStore/LinkedProducts/LinkedProducts.reducer';

import BrowserDatabase from 'Util/BrowserDatabase';
import { UPDATE_LINKED_PRODUCTS } from './LinkedProducts.action';
import { LINKED_PRODUCTS } from './LinkedProducts.dispatcher';

export {
    UPSELL,
    RELATED,
    CROSS_SELL
};

const initialState = {
    linkedProducts: BrowserDatabase.getItem(LINKED_PRODUCTS) || {
        upsell: {},
        related: {},
        crosssell: {}
    }
};

const LinkedProductsReducer = (state = initialState, action) => {
    const { type } = action;

    if (type !== UPDATE_LINKED_PRODUCTS) {
        return state;
    }

    const {
        linkedProducts: {
            [UPSELL]: upsell,
            [RELATED]: related,
            [CROSS_SELL]: crosssell
        }
    } = action;

    const {
        linkedProducts: {
            [CROSS_SELL]: prevCrossSell
        }
    } = state;

    return {
        ...state,
        linkedProducts: {
            [UPSELL]: upsell,
            [RELATED]: related,
            [CROSS_SELL]: {
                ...prevCrossSell,
                ...related,
                items: Object.values({
                    ...prevCrossSell.items,
                    ...crosssell && crosssell.items
                })
            }
        }
    };
};

export default LinkedProductsReducer;
