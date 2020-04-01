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
import OverlayComponent from 'Component/Overlay/Overlay.component';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';

export const mapStateToProps = state => ({
    activeOverlay: state.OverlayReducer.activeOverlay,
    areOtherOverlaysOpen: state.OverlayReducer.areOtherOverlaysOpen,
    navigationState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState
});

export default connect(mapStateToProps)(OverlayComponent);
