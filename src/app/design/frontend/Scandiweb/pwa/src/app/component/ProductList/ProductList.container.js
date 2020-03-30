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

import { withRouter } from 'react-router-dom';

import {
    ProductListContainer as SourceProductListContainer, UPDATE_PAGE_FREQUENCY
} from 'SourceComponent/ProductList/ProductList.container';

export { UPDATE_PAGE_FREQUENCY };

export class ProductListContainer extends SourceProductListContainer {
    static defaultProps = {
        ...this.defaultProps,
        pageSize: 15
    };
}

export default withRouter(ProductListContainer);
