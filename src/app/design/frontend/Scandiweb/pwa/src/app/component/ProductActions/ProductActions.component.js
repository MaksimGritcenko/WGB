import SourceProductActions from 'SourceComponent/ProductActions/ProductActions.component';
import TextPlaceholder from 'Component/TextPlaceholder';
import { GROUPED } from 'Util/Product';

import './ProductActions.style.override';

export default class ProductActions extends SourceProductActions {
    renderBrand() {
        const {
            productOrVariant: { attributes: { brand: { attribute_value: brand } = {} } = {} },
            showOnlyIfLoaded
        } = this.props;

        const contentToShow = showOnlyIfLoaded(
            brand,
            (
                <p block="ProductActions" elem="Brand" itemProp="brand">
                    <TextPlaceholder content={ brand } />
                </p>
            )
        );

        const emptyPlace = <br />;

        return contentToShow || emptyPlace;
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

    render() {
        return (
            <article block="ProductActions">
                { this.renderBrand() }
                { this.renderNameAndPrice() }
                { this.renderShortDescription() }
                <div block="ProductActions" elem="AddToCartWrapper">
                    { this.renderAddToCart() }
                    { this.renderProductWishlistButton() }
                </div>
                { this.renderReviews() }
                { this.renderConfigurableAttributes() }
                { this.renderGroupedItems() }
                { this.renderTierPrices() }
            </article>
        );
    }
}
