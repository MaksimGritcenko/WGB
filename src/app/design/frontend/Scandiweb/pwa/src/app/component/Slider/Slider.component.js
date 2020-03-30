import PropTypes from 'prop-types';
import SourceSlider, { ACTIVE_SLIDE_PERCENT } from 'SourceComponent/Slider/Slider.component';

export {
    ANIMATION_DURATION,
    ACTIVE_SLIDE_PERCENT
} from 'SourceComponent/Slider/Slider.component';
import './Slider.style.override';

export default class Slider extends SourceSlider {
    static propTypes = {
        ...this.propTypes,
        isSideClick: PropTypes.bool
    };

    static defaultProps = {
        ...this.defaultProps,
        isSideClick: false
    };

    calculateNextSlide(state) {
        const {
            translateX: translate,
            lastTranslateX: lastTranslate
        } = state;
        const { onActiveImageChange, isSideClick } = this.props;
        const { prevActiveImage: prevActiveSlider } = this.state;

        const slideSize = this.sliderWidth;

        const fullSliderSize = this.getFullSliderWidth();

        const activeSlidePosition = translate / slideSize;
        const activeSlidePercent = Math.abs(activeSlidePosition % 1);
        const isSlideBack = translate > lastTranslate;

        if (!translate) {
            if (isSideClick) return this.onClickChangeSlide(state, slideSize, lastTranslate, fullSliderSize);

            return -prevActiveSlider;
        }

        if (translate >= 0) {
            onActiveImageChange(0);
            return 0;
        }

        if (translate < -fullSliderSize) {
            const activeSlide = Math.round(fullSliderSize / -slideSize);
            onActiveImageChange(-activeSlide);
            return activeSlide;
        }

        if (isSlideBack && activeSlidePercent < 1 - ACTIVE_SLIDE_PERCENT) {
            const activeSlide = Math.ceil(activeSlidePosition);
            onActiveImageChange(-activeSlide);
            return activeSlide;
        }

        if (!isSlideBack && activeSlidePercent > ACTIVE_SLIDE_PERCENT) {
            const activeSlide = Math.floor(activeSlidePosition);
            onActiveImageChange(-activeSlide);
            return activeSlide;
        }

        const activeSlide = Math.round(activeSlidePosition);
        onActiveImageChange(-activeSlide);
        return activeSlide;
    }
}
