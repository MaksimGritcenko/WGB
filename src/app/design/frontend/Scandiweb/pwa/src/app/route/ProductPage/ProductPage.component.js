/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-len */
import SourceProductPage from 'SourceRoute/ProductPage/ProductPage.component';

import ProductGallery from 'Component/ProductGallery';
import ProductActions from 'Component/ProductActions';
import ProductLinks from 'Component/ProductLinks';
import DragBar from 'Component/DragBar';
import Link from 'Component/Link';
import ProductInformation from 'Component/ProductInformation';
import ConditionalWrapper from 'Component/ConditionalWrapper';
import ContentWrapper from 'Component/ContentWrapper';
import isMobile from 'Util/Mobile';
import Event, { EVENT_GTM_PRODUCT_DETAIL } from 'Util/Event';
import { RELATED, UPSELL } from 'Store/LinkedProducts/LinkedProducts.reducer';

import './ProductPage.style.override';

export default class ProductPage extends SourceProductPage {
    componentDidUpdate(prevProps) {
        const { areDetailsLoaded, location: { pathname } } = this.props;
        const { areDetailsLoaded: prevAreDetailsLoaded, location: { pathname: prevPathname } } = prevProps;

        if (
            (areDetailsLoaded && areDetailsLoaded !== prevAreDetailsLoaded)
            || (areDetailsLoaded && pathname !== prevPathname)
        ) {
            this._gtmProductDetail();
        }
    }

    _gtmProductDetail() {
        const { product, location: { pathname }, configurableVariantIndex } = this.props;

        if (product && product.price && product.attributes) {
            Event.dispatch(EVENT_GTM_PRODUCT_DETAIL, {
                product: { ...product, configurableVariantIndex },
                pathname
            });
        }
    }

    renderGoBackIcon() {
        return (
            <svg
              block="ProductPage"
              elem="GoBackIcon"
              width="19px"
              height="18px"
              viewBox="0 0 19 18"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xlink="http://www.w3.org/1999/xlink"
            >
                <g id="Page-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="PDP_mobile" transform="translate(-15.000000, -66.000000)" stroke="#090403">
                        <g id="Group-3" transform="translate(16.000000, 66.000000)">
                            <g id="Group-2">
                                <polyline id="Path-2" transform="translate(4.482767, 9.241384) scale(1, -1) rotate(90.000000) translate(-4.482767, -9.241384) " points="-4 5 4.48276724 13.4827672 12.9655345 5" />
                                <polyline id="Path-3" points="0.241383619 9.24138362 10.2205848 9.24138362 17.3483583 9.24138362" />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    renderGoBackText(categoryName) {
        return (
            <>
                <p
                  block="ProductPage"
                  elem="GoBackText"
                >
                    { __('Back to ') }
                    <span
                      block="ProductPage"
                      elem="Category"
                    >
                        { categoryName }
                    </span>
                </p>
            </>
        );
    }

    renderPDPHeader() {
        const { currentCategory: { name, url_path } } = this.props;

        if (!name || !url_path) {
            this.isPDPHeaderPresent = false;
            return null;
        }
        this.isPDPHeaderPresent = true;

        return (
            <div block="ProductPage" elem="Header">
                <Link
                  block="ProductPage"
                  elem="GoBack"
                  to={ `/category/${url_path}` }
                >
                    { this.renderGoBackIcon() }
                    { this.renderGoBackText(name) }
                </Link>
            </div>
        );
    }

    renderProductGallery() {
        const { productOrVariant, areDetailsLoaded } = this.props;
        const { isPDPHeaderPresent } = this;

        return (
            <ProductGallery
              isPDPHeaderPresent={ isPDPHeaderPresent }
              product={ productOrVariant }
              areDetailsLoaded={ areDetailsLoaded }
            />
        );
    }

    freezeScroll() {
        if (isMobile.any()) {
            document.body.classList.add('overscrollDisabled');
        }
    }

    unFreezeScroll() {
        if (isMobile.any()) {
            document.body.classList.remove('overscrollDisabled');
        }
    }

    componentDidMount() {
        this.freezeScroll();
    }

    componentWillUnmount() {
        this.unFreezeScroll();
    }

    renderProductLinks() {
        const { areDetailsLoaded } = this.props;

        return (
            <>
                <ProductLinks
                  linkType={ RELATED }
                  title={ __('Recommended for you') }
                  areDetailsLoaded={ areDetailsLoaded }
                />
                <ProductLinks
                  linkType={ UPSELL }
                  title={ __('You might also like') }
                  areDetailsLoaded={ areDetailsLoaded }
                />
            </>
        );
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
            <ConditionalWrapper
              condition={ !!isMobile.any() }
              ifTrue={ children => <DragBar>{ children }</DragBar> }
              ifFalse={ children => <ContentWrapper mix={ { block: 'ProductContentWrapper' } } label={ __('Product information') }>{ children }</ContentWrapper> }
            >
                <ProductActions
                  getLink={ getLink }
                  updateConfigurableVariant={ updateConfigurableVariant }
                  product={ dataSource }
                  productOrVariant={ productOrVariant }
                  parameters={ parameters }
                  areDetailsLoaded={ areDetailsLoaded }
                  configurableVariantIndex={ configurableVariantIndex }
                />
                <ProductInformation
                  product={ { ...dataSource, parameters } }
                  areDetailsLoaded={ areDetailsLoaded }
                />
                { isMobile.any() ? this.renderProductLinks() : null }
            </ConditionalWrapper>
        );
    }

    render() {
        return (
            <>
                <main
                  block="ProductPage"
                  aria-label="Product page"
                  itemScope
                  itemType="http://schema.org/Product"
                >
                    { /* Wrap to ensure proper scrolling on desktop */ }
                    <ConditionalWrapper
                      condition={ !isMobile.any() }
                      ifTrue={ children => <div block="ProductPage" elem="UpperPartWrapper">{ children }</div> }
                    >
                        { this.renderPDPHeader() }
                        { this.renderProductGallery() }
                        { this.renderAdditionalSections() }
                    </ConditionalWrapper>
                    { isMobile.any() ? null : this.renderProductLinks() }
                </main>
            </>
        );
    }

}