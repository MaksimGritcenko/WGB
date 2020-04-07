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
import { StoreFinderDispatcher } from 'Store/StoreFinder';
import { BreadcrumbsDispatcher } from 'Store/Breadcrumbs';
import { CmsBlocksAndSliderDispatcher } from 'Store/CmsBlocksAndSlider';
import StoreFinder from './StoreFinder.component';

const mapStateToProps = state => ({
    storeListCities: state.StoreFinderReducer.storeListCities,
    storeListMapped: state.StoreFinderReducer.storeListMapped,
    storeByName: state.StoreFinderReducer.storeByName,
    blocks: state.CmsBlocksAndSliderReducer.blocks
});

const mapDispatchToProps = dispatch => ({
    requestStores: () => {
        StoreFinderDispatcher.handleData(dispatch);
    },

    enableBreadcrumbs: () => {
        BreadcrumbsDispatcher.update([
            {
                url: '',
                name: __('Shops')
            },
            {
                url: '/',
                name: __('Home')
            }
        ], dispatch);
    },

    requestBlocks: options => CmsBlocksAndSliderDispatcher.handleData(dispatch, options)
});

const StoreFinderContainer = connect(mapStateToProps, mapDispatchToProps)(StoreFinder);

export default StoreFinderContainer;
