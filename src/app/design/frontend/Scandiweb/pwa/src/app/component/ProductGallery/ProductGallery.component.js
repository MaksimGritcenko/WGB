import { withRouter } from 'react-router';
import isMobile from 'Util/Mobile';
import SliderVertical from 'Component/SliderVertical';
import VideoPopup from 'Component/VideoPopup';
import Image from 'Component/Image';
import {
    GALLERY_LENGTH_BEFORE_COLLAPSE,
    MAX_ZOOM_SCALE,
    IMAGE_TYPE,
    VIDEO_TYPE,
    PLACEHOLDER_TYPE,
    ProductGallery as SourceProductGallery
} from 'SourceComponent/ProductGallery/ProductGallery.component';
import ProductExhibition from 'Component/ProductExhibition';
import media, { PRODUCT_MEDIA } from 'Util/Media/Media';

import './ProductGallery.override.style';

class ProductGallery extends SourceProductGallery {
    renderSlider() {
        const {
            gallery,
            activeImage,
            isZoomEnabled,
            onActiveImageChange,
            isPDPHeaderPresent
        } = this.props;

        return (
            <div ref={ this.imageRef }>
                <SliderVertical
                  ref={ this.sliderRef }
                  mix={ { block: 'ProductGallery', elem: 'Slider' } }
                  showCrumbs
                  isPDPHeaderPresent={ isPDPHeaderPresent }
                  activeImage={ activeImage }
                  onActiveImageChange={ onActiveImageChange }
                  isInteractionDisabled={ isZoomEnabled }
                >
                    { gallery.map(this.renderSlide) }
                </SliderVertical>
                { this.renderGalleryNotice() }
            </div>
        );
    }

    _getSrc(mediaData) {
        const {
            file, base: { url: baseUrl } = {}
        } = mediaData || {};

        return baseUrl || media(file, PRODUCT_MEDIA);
    }

    _getAlt(mediaData) {
        const { label } = mediaData || {};

        return label || '';
    }

    renderImageForDesktop(mediaData, index) {
        const src = this._getSrc(mediaData);
        const alt = this._getAlt(mediaData);

        return (
            <Image
              src={ src }
              key={ index }
              ratio="custom"
              mix={ {
                  block: 'ProductGallery',
                  elem: 'SliderImage',
                  mods: { isPlaceholder: !src }
              } }
              isPlaceholder={ !src }
              alt={ alt }
            />
        );
    }

    renderExhibitionSlide(media, index) {
        const { media_type } = media;

        switch (media_type) {
        case IMAGE_TYPE:
            return this.renderImageForDesktop(media, index);
        case VIDEO_TYPE:
            return this.renderVideo(media, index);
        case PLACEHOLDER_TYPE:
            return this.renderPlaceholder(index);
        default:
            return null;
        }
    }

    renderExhibition() {
        const {
            gallery
        } = this.props;

        return (
            <ProductExhibition>
                { gallery.map((item, index) => this.renderExhibitionSlide(item, index)) }
            </ProductExhibition>
        );
    }

    render() {
        if (isMobile.any()) {
            return (
                <div block="ProductGallery">
                    { this.renderSlider() }
                    <VideoPopup />
                </div>
            );
        }

        return (
            <div block="ProductGallery">
                { this.renderExhibition() }
                { /* <VideoPopup /> */ }
            </div>
        );
    }
}


export {
    GALLERY_LENGTH_BEFORE_COLLAPSE,
    MAX_ZOOM_SCALE,
    IMAGE_TYPE,
    VIDEO_TYPE,
    PLACEHOLDER_TYPE
};
export default withRouter(ProductGallery);
