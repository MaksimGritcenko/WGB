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
import ProductList from 'SourceComponent/ProductList';
import { connect } from 'react-redux';

import {
    CategoryProductListContainer as SourceCategoryProductListContainer, mapStateToProps, mapDispatchToProps
} from 'SourceComponent/CategoryProductList/CategoryProductList.container';

export { mapStateToProps, mapDispatchToProps };

export class CategoryProductListContainer extends SourceCategoryProductListContainer {
    render() {
        return (
            <ProductList
              { ...this.props }
              { ...this.containerProps() }
              isForCategory
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryProductListContainer);
