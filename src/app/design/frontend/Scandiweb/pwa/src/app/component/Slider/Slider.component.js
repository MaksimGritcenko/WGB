import PropTypes from 'prop-types';
import SourceSlider, { ACTIVE_SLIDE_PERCENT, ANIMATION_DURATION } from 'SourceComponent/Slider/Slider.component';
import Draggable from 'Component/Draggable';
import CSS from 'Util/CSS';

import './Slider.style.override.style';

const SCROLL_START_INDEX = 20;

export {
    ANIMATION_DURATION,
    ACTIVE_SLIDE_PERCENT
} from 'SourceComponent/Slider/Slider.component';

export default class Slider extends SourceSlider {
    static propTypes = {
        ...this.propTypes,
        isSideClick: PropTypes.bool,
        animationDuration: PropTypes.number,
        isScrollEnabled: PropTypes.bool
    };

    static defaultProps = {
        ...this.defaultProps,
        isSideClick: false,
        animationDuration: ANIMATION_DURATION,
        isScrollEnabled: false
    };

    state = {
        ...this.state,
        isGesturesEnabled: true
    }

    componentDidMount() {
        const { animationDuration, isScrollEnabled } = this.props;
        const sliderChildren = this.draggableRef.current.children;
        const sliderWidth = this.draggableRef.current.offsetWidth;
        this.sliderWidth = sliderWidth;

        if (!sliderChildren || !sliderChildren[0]) return;

        if (isScrollEnabled) this.enableScroll();

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

            this.disableGestures();
        }
    }

    disableGestures() {
        const { animationDuration } = this.props;

        this.setState({ isGesturesEnabled: false });

        setTimeout(() => {
            this.setState({ isGesturesEnabled: true });
        }, animationDuration);
    }

    enableScroll() {
        window.addEventListener('wheel', this.handleScroll, true);
    }

    handleScroll = ({ deltaX }) => {
        const { isGesturesEnabled } = this.state;

        if (!isGesturesEnabled) return;

        const { onActiveImageChange, activeImage, children } = this.props;
        const slideCount = children.length;

        if (deltaX < -SCROLL_START_INDEX && activeImage > 0) {
            onActiveImageChange(activeImage - 1);
            this.disableGestures();
        }

        if (deltaX > SCROLL_START_INDEX && activeImage < slideCount - 1) {
            onActiveImageChange(activeImage + 1);
            this.disableGestures();
        }
    }

    handleDrag = (state) => {
        const { isGesturesEnabled } = this.state;
        const { translateX } = state;

        if (!isGesturesEnabled) return;

        const translate = translateX;

        const fullSliderSize = this.getFullSliderWidth();

        if (translate < 0 && translate > -fullSliderSize && isGesturesEnabled) {
            CSS.setVariable(
                this.draggableRef,
                'translateX',
                `${translate}px`
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

    handleDragEnd = (state, callback) => {
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

        this.setState({ isGesturesEnabled: false });

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
