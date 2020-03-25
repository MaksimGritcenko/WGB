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
import { withRouter } from 'react-router';
import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay';
import { goToPreviousNavigationState, changeNavigationState } from 'Store/Navigation';
import { TOP_NAVIGATION_TYPE, BOTTOM_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { CATEGORY_FILTER_OVERLAY_ID } from 'Component/CategoryFilterOverlay/CategoryFilterOverlay.component';
import {
    CategoryFilterOverlayContainer as SourceCategoryFilterOverlayContainer, mapStateToProps
} from 'SourceComponent/CategoryFilterOverlay/CategoryFilterOverlay.container';

export const mapDispatchToProps = dispatch => ({
    showOverlay: overlayKey => dispatch(toggleOverlayByKey(overlayKey)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    goToPreviousHeaderState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE)),
    goToPreviousNavigationState: () => dispatch(goToPreviousNavigationState(BOTTOM_NAVIGATION_TYPE)),
    changeHeaderState: state => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    changeNavigationState: state => dispatch(changeNavigationState(BOTTOM_NAVIGATION_TYPE, state))
});

export { mapStateToProps };

export class CategoryFilterOverlayContainer extends SourceCategoryFilterOverlayContainer {
    containerFunctions = {
        ...this.containerFunctions,
        onHide: this.onHide.bind(this),
        onFilterButtonClick: this.onFilterButtonClick.bind(this)
    };

    onFilterButtonClick() {
        const { showOverlay } = this.props;
        showOverlay(CATEGORY_FILTER_OVERLAY_ID);
    }

    onSeeResultsClick() {
        const { goToPreviousNavigationState } = this.props;
        goToPreviousNavigationState();
    }

    onHide() {
        const {
            goToPreviousHeaderState
        } = this.props;

        goToPreviousHeaderState();
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CategoryFilterOverlayContainer));
