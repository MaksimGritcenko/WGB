import {
    ProductGalleryContainer as SourceProductGalleryContainer,
    AMOUNT_OF_PLACEHOLDERS,
    THUMBNAIL_KEY
} from 'SourceComponent/ProductGallery/ProductGallery.container';

import { IMAGE_TYPE } from './ProductGallery.component';

export { THUMBNAIL_KEY, AMOUNT_OF_PLACEHOLDERS };

export class ProductGalleryContainer extends SourceProductGalleryContainer {
    getGalleryPictures() {
        const {
            areDetailsLoaded,
            product: {
                media_gallery_entries: mediaGallery = [],
                [THUMBNAIL_KEY]: { url } = {},
                name
            }
        } = this.props;

        if (mediaGallery.length) {
            return Object.values(mediaGallery.reduce((acc, srcMedia) => {
                const {
                    types,
                    position,
                    disabled
                } = srcMedia;

                const canBeShown = !disabled;
                if (!canBeShown) return acc;

                const isThumbnail = types.includes(THUMBNAIL_KEY);
                if (isThumbnail) return acc;
                const key = isThumbnail ? 0 : position + 1;

                return {
                    ...acc,
                    [key]: srcMedia
                };
            }, {}));
        }

        if (!url) {
            return Array(AMOUNT_OF_PLACEHOLDERS + 1).fill({ media_type: 'placeholder' });
        }

        const placeholders = !areDetailsLoaded
            ? Array(AMOUNT_OF_PLACEHOLDERS).fill({ media_type: 'placeholder' }) : [];

        return [
            {
                thumbnail: { url },
                base: { url },
                id: THUMBNAIL_KEY,
                label: name,
                media_type: IMAGE_TYPE
            },
            ...placeholders
        ];
    }

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
