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
import {
    CategoryFilterOverlayContainer as SourceCategoryFilterOverlayContainer, mapDispatchToProps, mapStateToProps
} from 'SourceComponent/CategoryFilterOverlay/CategoryFilterOverlay.container';

export { mapDispatchToProps, mapStateToProps };

export class CategoryFilterOverlayContainer extends SourceCategoryFilterOverlayContainer {
    containerFunctions = {
        ...this.containerFunctions,
        onHide: this.onHide.bind(this)
    };

    onHide() {
        const {
            goToPreviousHeaderState
        } = this.props;

        goToPreviousHeaderState();
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CategoryFilterOverlayContainer));
