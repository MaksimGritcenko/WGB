import {
    ProductGalleryContainer as SourceProductGalleryContainer
} from 'SourceComponent/ProductGallery/ProductGallery.container';

export {
    THUMBNAIL_KEY,
    AMOUNT_OF_PLACEHOLDERS
} from 'SourceComponent/ProductGallery/ProductGallery.container';

export class ProductGalleryContainer extends SourceProductGalleryContainer {
    containerProps = () => {
        const { activeImage, isZoomEnabled } = this.state;
        const { product: { id }, isPDPHeaderPresent } = this.props;

        return {
            gallery: this.getGalleryPictures(),
            productName: this._getProductName(),
            activeImage,
            isZoomEnabled,
            productId: id,
            isPDPHeaderPresent
        };
    };
}

export default ProductGalleryContainer;
