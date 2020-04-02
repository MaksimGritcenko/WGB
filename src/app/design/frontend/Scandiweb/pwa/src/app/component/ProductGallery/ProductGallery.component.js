import { withRouter } from 'react-router';
import SliderVertical from 'Component/SliderVertical';
import {
    GALLERY_LENGTH_BEFORE_COLLAPSE,
    MAX_ZOOM_SCALE,
    IMAGE_TYPE,
    VIDEO_TYPE,
    PLACEHOLDER_TYPE,
    ProductGallery as SourceProductGallery
} from 'SourceComponent/ProductGallery/ProductGallery.component';

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
}


export {
    GALLERY_LENGTH_BEFORE_COLLAPSE,
    MAX_ZOOM_SCALE,
    IMAGE_TYPE,
    VIDEO_TYPE,
    PLACEHOLDER_TYPE
};
export default withRouter(ProductGallery);
