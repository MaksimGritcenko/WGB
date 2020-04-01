import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
    ProductPageContainer as SourceProductPageContainer,
    mapStateToProps as sourceMapStateToProps,
    mapDispatchToProps
} from 'SourceRoute/ProductPage/ProductPage.container';

const mapStateToProps = state => ({
    ...sourceMapStateToProps(state),
    currentCategory: state.CategoryReducer.category
});

class ProductPageContainer extends SourceProductPageContainer {
    _onProductUpdate() {
        const dataSource = this._getDataSource();

        if (Object.keys(dataSource).length) {
            this._updateBreadcrumbs(dataSource);
            this._updateNavigationState();
        }
    }
}

export { mapStateToProps, mapDispatchToProps };
const ProductPageContainerWrapper = connect(mapStateToProps, mapDispatchToProps)(ProductPageContainer);
export default withRouter(ProductPageContainerWrapper);
