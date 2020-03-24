import SourceProductPage from 'SourceRoute/ProductPage/ProductPage.component';
import ProductGallery from 'Component/ProductGallery';
import ProductActions from 'Component/ProductActions';
import DragBar from 'Component/DragBar';

export default class ProductPage extends SourceProductPage {
    renderProductPageContent() {
        const {
            configurableVariantIndex,
            parameters,
            getLink,
            dataSource,
            updateConfigurableVariant,
            productOrVariant,
            areDetailsLoaded
        } = this.props;

        return (
            <>
                <ProductGallery
                  product={ productOrVariant }
                  areDetailsLoaded={ areDetailsLoaded }
                />
                <ProductActions
                      getLink={ getLink }
                      updateConfigurableVariant={ updateConfigurableVariant }
                      product={ dataSource }
                      productOrVariant={ productOrVariant }
                      parameters={ parameters }
                      areDetailsLoaded={ areDetailsLoaded }
                      configurableVariantIndex={ configurableVariantIndex }
                />
                <DragBar />
            </>
        );
    }
}