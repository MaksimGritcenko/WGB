import PropTypes from 'prop-types';
import SourceSlider, { ACTIVE_SLIDE_PERCENT, ANIMATION_DURATION } from 'SourceComponent/Slider/Slider.component';
import Draggable from 'Component/Draggable';
import CSS from 'Util/CSS';

import './Slider.style.override.style';

export {
    ANIMATION_DURATION,
    ACTIVE_SLIDE_PERCENT
} from 'SourceComponent/Slider/Slider.component';

export default class Slider extends SourceSlider {
    static propTypes = {
        ...this.propTypes,
        isSideClick: PropTypes.bool,
        animationDuration: PropTypes.number
    };

    static defaultProps = {
        ...this.defaultProps,
        isSideClick: false,
        animationDuration: ANIMATION_DURATION
    };

    componentDidMount() {
        const { animationDuration } = this.props;
        const sliderChildren = this.draggableRef.current.children;
        const sliderWidth = this.draggableRef.current.offsetWidth;
        this.sliderWidth = sliderWidth;

        if (!sliderChildren || !sliderChildren[0]) return;

        sliderChildren[0].onload = () => {
            CSS.setVariable(this.sliderRef, 'slider-height', `${sliderChildren[0].offsetHeight}px`);
        };

        setTimeout(() => {
            CSS.setVariable(this.sliderRef, 'slider-height', `${sliderChildren[0].offsetHeight}px`);
        }, animationDuration);
    }

    componentDidUpdate(prevProps) {
        const { activeImage: prevActiveImage } = prevProps;
        const { activeImage, animationDuration } = this.props;

        if (activeImage !== prevActiveImage) {
            const newTranslate = -activeImage * this.sliderWidth;

            CSS.setVariable(
                this.draggableRef,
                'animation-speed',
                `${ Math.abs((prevActiveImage - activeImage) * animationDuration) }ms`
            );

            CSS.setVariable(
                this.draggableRef,
                'translateX',
                `${newTranslate}px`
            );
        }
    }

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

    handleDragEnd(state, callback) {
        const { animationDuration } = this.props;
        const activeSlide = this.calculateNextSlide(state);

        const slideSize = this.sliderWidth;

        const newTranslate = activeSlide * slideSize;

        CSS.setVariable(this.draggableRef, 'animation-speed', `${ animationDuration }ms`);

        CSS.setVariable(
            this.draggableRef,
            'translateX',
            `${newTranslate}px`
        );

        callback({
            originalX: newTranslate,
            lastTranslateX: newTranslate
        });
    }

    handleDragStart = () => {
        CSS.setVariable(this.draggableRef, 'animation-speed', '0');
    }

    render() {
        const {
            showCrumbs,
            mix,
            activeImage,
            children
        } = this.props;

        return (
            <div
              block="Slider"
              mix={ mix }
              ref={ this.sliderRef }
            >
                <Draggable
                  mix={ { block: 'Slider', elem: 'Wrapper' } }
                  draggableRef={ this.draggableRef }
                  onDragStart={ this.handleDragStart }
                  onDragEnd={ this.handleDragEnd }
                  onDrag={ this.handleDrag }
                  shiftX={ -activeImage * this.sliderWidth }
                >
                    { children }
                </Draggable>
                { showCrumbs && this.renderCrumbs() }
            </div>
        );
    }
}
