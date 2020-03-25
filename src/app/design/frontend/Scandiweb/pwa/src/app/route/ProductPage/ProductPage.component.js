import SourceProductPage from 'SourceRoute/ProductPage/ProductPage.component';

import ProductGallery from 'Component/ProductGallery';
import ProductActions from 'Component/ProductActions';
import DragBar from 'Component/DragBar';
import Link from 'Component/Link';
import ProductInformation from 'Component/ProductInformation';
import ProductReviews from 'Component/ProductReviews';
import RelatedProducts from 'Component/RelatedProducts'

import './ProductPage.style.override';

export default class ProductPage extends SourceProductPage {
    getCategory() {
        const { product: { categories = [] } } = this.props;

        return categories[categories.length - 1] || {};
    }

    renderGoBackIcon() {
        return <>
            <svg 
                block="ProductPage"
                elem="GoBackIcon"
                width="19px" height="18px" viewBox="0 0 19 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink"
            >
                <g id="Page-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="PDP_mobile" transform="translate(-15.000000, -66.000000)" stroke="#090403">
                        <g id="Group-3" transform="translate(16.000000, 66.000000)">
                            <g id="Group-2">
                                <polyline id="Path-2" transform="translate(4.482767, 9.241384) scale(1, -1) rotate(90.000000) translate(-4.482767, -9.241384) " points="-4 5 4.48276724 13.4827672 12.9655345 5"></polyline>
                                <polyline id="Path-3" points="0.241383619 9.24138362 10.2205848 9.24138362 17.3483583 9.24138362"></polyline>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        </>
    }

    renderGoBackText(categoryName) {
        return <>
            <p
              block="ProductPage"
              elem="GoBackText"
            >
                {__('Back to ')}
                <span 
                  block="ProductPage"
                  elem="Category"
                >
                    {categoryName}
                </span>
            </p>
        </>
    }

    renderPDPHeader() {
        const { name: categoryName, url_path } = this.getCategory() || '';

        if (!url_path) return null;
        return <>
            <div block="ProductPage" elem="Header">
                <Link 
                  block="ProductPage"
                  elem="GoBack"
                  to={`/${url_path}`}
                >
                    { this.renderGoBackIcon() }
                    { this.renderGoBackText(categoryName) }
                </Link>
            </div>
        </>
    }

    renderProductGallery() {
        const { productOrVariant, areDetailsLoaded } = this.props;
        return (
            <ProductGallery
              product={productOrVariant}
              areDetailsLoaded={areDetailsLoaded}
            />
        )
    }
    
    renderProductPageContent() {
        return <>
            { this.renderPDPHeader() }
            { this.renderProductGallery() }     
        </>
    }

    renderAdditionalSections() {
        const {
            productOrVariant,
            configurableVariantIndex,
            parameters,
            getLink,
            dataSource,
            updateConfigurableVariant,
            areDetailsLoaded
        } = this.props;

        return (
            <DragBar>
                <ProductActions
                    getLink={getLink}
                    updateConfigurableVariant={updateConfigurableVariant}
                    product={dataSource}
                    productOrVariant={productOrVariant}
                    parameters={parameters}
                    areDetailsLoaded={areDetailsLoaded}
                    configurableVariantIndex={configurableVariantIndex}
                />
                <ProductInformation
                    product={{ ...dataSource, parameters }}
                    areDetailsLoaded={areDetailsLoaded}
                />
                <ProductReviews
                    product={dataSource}
                    areDetailsLoaded={areDetailsLoaded}
                />
                <RelatedProducts
                    product={dataSource}
                    areDetailsLoaded={areDetailsLoaded}
                />
            </DragBar>
        );
    }
}
