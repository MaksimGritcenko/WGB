import SourceProductActions from 'SourceComponent/ProductActions/ProductActions.component';
import TextPlaceholder from 'Component/TextPlaceholder';
import isMobile from 'Util/Mobile';
import { GROUPED } from 'Util/Product';

import './ProductActions.style.override';

export default class ProductActions extends SourceProductActions {
    state = {
        isBrandRendered: false
    };

    renderNameAndBrand() {
        const {
            product: { name }
        } = this.props;

        return (
            <section
              block="ProductActions"
              elem="Section"
              mods={ { type: 'name' } }
            >
                { this.renderBrand() }
                <p block="ProductActions" elem="Title" itemProp="name">
                    <TextPlaceholder content={ name } length="medium" />
                </p>
            </section>
        );
    }

    renderBrand() {
        const {
            productOrVariant: { attributes: { brand: { attribute_value: brand } = {} } = {} },
            showOnlyIfLoaded
        } = this.props;

        return showOnlyIfLoaded(
            brand,
            (
                <p block="ProductActions" elem="Brand" itemProp="brand">
                    <TextPlaceholder content={ brand } />
                </p>
            )
        );
    }

    renderNameAndPrice() {
        const {
            product: {
                name,
                type_id
            }
        } = this.props;

        if (type_id === GROUPED) return null;

        return (
            <div block="ProductActions" elem="NameAndPrice">
                <p block="ProductActions" elem="Name">{ name }</p>
                { this.renderPriceWithSchema() }
            </div>
        );
    }

    renderMobile() {
        return (
            <>
                { this.renderBrand() }
                { this.renderNameAndPrice() }
            </>
        );
    }

    renderDesktop() {
        return (
            <>
                { this.renderPriceWithSchema() }
                { this.renderNameAndBrand() }
            </>
        );
    }

    render() {
        return (
            <article block="ProductActions">
                { isMobile.any()
                    ? this.renderMobile()
                    : this.renderDesktop() }
                { this.renderShortDescription() }
                <div block="ProductActions" elem="AddToCartWrapper">
                    { this.renderQuantityInput() }
                    { this.renderAddToCart() }
                    { this.renderProductWishlistButton() }
                </div>
                { this.renderReviews() }
                { this.renderSkuAndStock() }
                { this.renderConfigurableAttributes() }
                { this.renderGroupedItems() }
                { this.renderTierPrices() }
            </article>
        );
    }
}
