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

import isMobile from 'Util/Mobile';
import {
    DEFAULT_STATE
} from 'Component/NavigationAbstract/NavigationAbstract.container';

import {
    DESKTOP_OVERLAYS,
    MOBILE_OVERLAYS
} from 'Component/Header/Header.component';

import {
    initialState
} from 'SourceStore/Navigation/Navigation.reducer';

import {
    CHANGE_NAVIGATION_STATE,
    GOTO_PREVIOUS_NAVIGATION_STATE
} from './Navigation.action';

export {
    TOP_NAVIGATION_TYPE,
    BOTTOM_NAVIGATION_TYPE
} from 'SourceStore/Navigation/Navigation.reducer';

export { DEFAULT_STATE };

const NavigationReducer = (state = initialState, action) => {
    const { navigationType, navigationState } = action;

    const {
        [navigationType]: {
            navigationStateHistory,
            navigationState: prevNavigationState
        } = {}
    } = state;

    switch (action.type) {
    case CHANGE_NAVIGATION_STATE:
        const { name: nextName, force = false } = navigationState;
        const { name: prevName } = prevNavigationState;

        if (nextName === prevName && !force) {
            navigationStateHistory[navigationStateHistory.length - 1] = navigationState;
        } else {
            navigationStateHistory.push(navigationState);
        }

        return {
            ...state,
            [navigationType]: {
                navigationStateHistory,
                navigationState
            }
        };

    case GOTO_PREVIOUS_NAVIGATION_STATE:
        const skippedStates = isMobile.any() ? MOBILE_OVERLAYS : DESKTOP_OVERLAYS;

        navigationStateHistory.pop();
        // eslint-disable-next-line fp/no-loops
        while (
            Object.keys(navigationStateHistory).length
            && skippedStates.includes(navigationStateHistory.slice(-1)[0].name)
        ) navigationStateHistory.pop();

        const newNavigationState = navigationStateHistory.slice(-1)[0];

        if (!newNavigationState) return state;

        return {
            ...state,
            [navigationType]: {
                navigationStateHistory,
                navigationState: newNavigationState
            }
        };

    default:
        return state;
    }
};

export default NavigationReducer;
