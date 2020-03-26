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

import { connect } from 'react-redux';
import { CATEGORY, FILTER } from 'Component/Header/Header.component';

import {
    NavigationTabsContainer as SourceNavigationTabsContainer, mapStateToProps, mapDispatchToProps
} from 'SourceComponent/NavigationTabs/NavigationTabs.container';

export { DEFAULT_NAVIGATION_TABS_STATE } from 'SourceComponent/NavigationTabs/NavigationTabs.container';

export class NavigationTabsContainer extends SourceNavigationTabsContainer {
    handleScroll = () => {
        const {
            navigationState: { isVisibleOnScroll },
            headerState: { name, title },
            hideActiveOverlay,
            setHeaderState
        } = this.props;

        if (name === FILTER && window.scrollY !== 0) {
            hideActiveOverlay();
            setHeaderState({ name: CATEGORY, title });
        }

        if (!isVisibleOnScroll) return;

        const windowY = window.scrollY;
        this.handleNavVisibilityOnScroll(windowY);
        this.scrollPosition = windowY;
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationTabsContainer);
