import { connect } from 'react-redux';
import isMobile from 'Util/Mobile';
import { withRouter } from 'react-router';

import {
    ProductPageContainer as SourceProductPageContainer,
    mapStateToProps,
    mapDispatchToProps
} from 'SourceRoute/ProductPage/ProductPage.container';

class ProductPageContainer extends SourceProductPageContainer {
    _onProductUpdate() {
        const dataSource = this._getDataSource();

        if (Object.keys(dataSource).length) {
            this._updateBreadcrumbs(dataSource);
            this._updateNavigationState();

            if (!isMobile.any()) this._updateHeaderState(dataSource);
        }
    }
}

export { mapStateToProps, mapDispatchToProps };
const ProductPageContainerWrapper = connect(mapStateToProps, mapDispatchToProps)(ProductPageContainer);
export default withRouter(ProductPageContainerWrapper);
