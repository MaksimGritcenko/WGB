import { withRouter } from 'react-router';

import SliderVertical from 'Component/SliderVertical';
import { ProductGallery as SourceProductGallery } from 'SourceComponent/ProductGallery/ProductGallery.component';
import {
    GALLERY_LENGTH_BEFORE_COLLAPSE,
    MAX_ZOOM_SCALE,
    IMAGE_TYPE,
    VIDEO_TYPE,
    PLACEHOLDER_TYPE
} from 'SourceComponent/ProductGallery/ProductGallery.component';

import './ProductGallery.style.override';

class ProductGallery extends SourceProductGallery {
    renderSlider() {
        const {
            gallery,
            activeImage,
            isZoomEnabled,
            onActiveImageChange
        } = this.props;

        return (
            <div ref={ this.imageRef }>
                <SliderVertical
                  ref={ this.sliderRef }
                  mix={ { block: 'ProductGallery', elem: 'Slider' } }
                  showCrumbs
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
