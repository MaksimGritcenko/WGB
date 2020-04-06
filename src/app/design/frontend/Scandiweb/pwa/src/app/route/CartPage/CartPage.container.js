/* eslint-disable react/prop-types */
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

import {
    CartPageContainer,
    mapStateToProps as sourceMapStateToProps,
    mapDispatchToProps
} from 'SourceRoute/CartPage/CartPage.container';

export const mapStateToProps = state => ({
    ...sourceMapStateToProps(state),
    guest_checkout: state.ConfigReducer.guest_checkout
});

export { mapDispatchToProps };

export default connect(mapStateToProps, mapDispatchToProps)(CartPageContainer);
