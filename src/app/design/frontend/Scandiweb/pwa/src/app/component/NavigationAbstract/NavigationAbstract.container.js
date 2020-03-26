/* eslint-disable react/require-render-return */
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
import { CATEGORY, FILTER, FAVORITES } from 'Component/Header/Header.component';
import SourceNavigationAbstractContainer
    from 'SourceComponent/NavigationAbstract/NavigationAbstract.container';

export { DEFAULT_STATE } from 'SourceComponent/NavigationAbstract/NavigationAbstract.container';
export const HISTORY_START_CATEGORY_STRING = 1;
export const HISTORY_END_CATEGORY_STRING = 8;
export class NavigationAbstractContainer extends SourceNavigationAbstractContainer {
    handleMobileRouteChange(history) {
        const {
            // hideActiveOverlay,
            setNavigationState,
            navigationState: { name }
        } = this.props;
        const { pathname } = history;
        // Find the new state name
        const newNavigationState = this.getNavigationState(pathname);
        // Update the state if new name is set
        if (name !== newNavigationState.name && name !== FILTER && name !== FAVORITES) {
            setNavigationState(newNavigationState);
        }

        // hideActiveOverlay();
        return { prevPathname: pathname };
    }

    handleDesktopRouteChange(history) {
        const { hideActiveOverlay } = this.props;
        const path = history.pathname.substr(HISTORY_START_CATEGORY_STRING, HISTORY_END_CATEGORY_STRING);
        if (path !== CATEGORY) hideActiveOverlay();
        return {};
    }
}
export default NavigationAbstractContainer;
