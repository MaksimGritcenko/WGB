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
import { GeoIPDispatcher } from 'Store/GeoIP';
import CookiePopup from './CookiePopup.component';

export const mapStateToProps = state => ({
    cookieText: state.ConfigReducer.cookie_text,
    cookieLink: state.ConfigReducer.cookie_link,
    allowedCountries: state.ConfigReducer.countries,
    isCountryLoading: state.GeoIPReducer.isLoading,
    isCountryLoadingFailed: state.GeoIPReducer.error,
    userLocation: state.GeoIPReducer.country
});

export const mapDispatchToProps = dispatch => ({
    getUserLocation: () => GeoIPDispatcher.handleData(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CookiePopup);
