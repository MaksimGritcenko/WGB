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
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FILTER } from 'Component/Header';
import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay';
import { goToPreviousNavigationState, changeNavigationState } from 'Store/Navigation';
import { TOP_NAVIGATION_TYPE, BOTTOM_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { CATEGORY_FILTER_OVERLAY_ID } from 'Component/CategoryFilterOverlay/CategoryFilterOverlay.component';
import {
    CategoryFilterOverlayContainer as SourceCategoryFilterOverlayContainer
} from 'SourceComponent/CategoryFilterOverlay/CategoryFilterOverlay.container';

export const mapStateToProps = state => ({
    isInfoLoading: state.ProductListInfoReducer.isLoading,
    isProductsLoading: state.ProductListReducer.isLoading,
    totalPages: state.ProductListReducer.totalPages,
    navigationState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState
});

export const mapDispatchToProps = dispatch => ({
    showOverlay: overlayKey => dispatch(toggleOverlayByKey(overlayKey)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    goToPreviousHeaderState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE)),
    goToPreviousNavigationState: () => dispatch(goToPreviousNavigationState(BOTTOM_NAVIGATION_TYPE)),
    changeHeaderState: state => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    changeNavigationState: state => dispatch(changeNavigationState(BOTTOM_NAVIGATION_TYPE, state))
});

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

    onVisible() {
        const {
            changeHeaderState,
            changeNavigationState,
            goToPreviousNavigationState,
            navigationState: prevNavigationState
        } = this.props;

        const { title: prevTitle } = prevNavigationState;

        const title = isMobile.any()
            ? prevTitle : __('Filters');

        changeHeaderState({
            name: FILTER,
            title,
            onCloseClick: () => goToPreviousNavigationState()
        });

        changeNavigationState({
            name: FILTER,
            isHidden: true
        });
    }

    onHide() {
        const {
            goToPreviousHeaderState
        } = this.props;

        goToPreviousHeaderState();
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CategoryFilterOverlayContainer));
