import { Children } from 'react';

import CSS from 'Util/CSS';
import Draggable from 'Component/Draggable';
import Slider, { ANIMATION_DRAG_EASING } from 'Component/Slider/Slider.component';
import { HORIZONTAL_INDEX, VERTICAL_INDEX } from 'Store/Slider/Slider.reducer';
import './SliderVertical.style';

export const ACTIVE_SLIDE_PERCENT = 0.1;
const SCROLL_START_INDEX = 0.9;
const TRANSITION_DELAY = 1300;

/**
 * Slider component
 * @class Slider
 */
export default class SliderVertical extends Slider {
    componentDidMount() {
        const { animationDuration, isScrollEnabled } = this.props;
        const sliderChildren = this.draggableRef.current.children;

        if (!sliderChildren || !sliderChildren[0]) return;

        if (isScrollEnabled) this.enableScroll();

        this.updateSliderHeight();

        sliderChildren[0].onload = () => {
            CSS.setVariable(this.sliderRef, 'slider-width', `${ (sliderChildren[0] || {}).offsetWidth }px`);
        };

        setTimeout(() => {
            CSS.setVariable(this.sliderRef, 'slider-width', `${ (sliderChildren[0] || {}).offsetWidth }px`);
        }, animationDuration);
        this.sliderHeight = this.draggableRef.current.offsetHeight;
    }

    updateSliderHeight() {
        const { isPDPHeaderPresent } = this.props;
        const headerAmount = isPDPHeaderPresent ? 2 : 1;

        CSS.setVariable(
            this.sliderRef,
            'slider-height',
            `calc(${window.innerHeight}px - (var(--header-height) * ${headerAmount}) - 110px)`
        );
    }

    componentDidUpdate(prevProps) {
        const {
            activeImage: prevActiveImage,
            isPDPHeaderPresent: prevIsPDPHeaderPresent
        } = prevProps;
        const {
            activeImage,
            isPDPHeaderPresent,
            animationDuration
        } = this.props;

        if (isPDPHeaderPresent !== prevIsPDPHeaderPresent) {
            this.updateSliderHeight();
        }

        if (activeImage !== prevActiveImage) {
            const newTranslate = -activeImage * this.sliderHeight;

            CSS.setVariable(
                this.draggableRef,
                'animation-speed',
                `${ Math.abs((prevActiveImage - activeImage) * animationDuration) }ms`
            );

            CSS.setVariable(
                this.draggableRef,
                'translateY',
                `${ newTranslate }px`
            );

            this.disableGestures();
        }
    }

    disableGestures() {
        const {
            sliderInAction,
            animationDuration,
            resetSliderInAction,
            changeSliderInAction
        } = this.props;

        if (sliderInAction === HORIZONTAL_INDEX) return;

        if (
            sliderInAction !== VERTICAL_INDEX
        ) {
            changeSliderInAction(VERTICAL_INDEX);
        }

        this.setState({ isGesturesEnabled: false });
        window.lastScrolled = new Date().getTime();

        setTimeout(() => {
            this.setState({ isGesturesEnabled: true });
            resetSliderInAction();
        }, animationDuration);
    }

    handleScroll = ({ deltaY }) => {
        const { isGesturesEnabled } = this.state;
        const { sliderInAction } = this.props;

        if (
            !isGesturesEnabled
            || sliderInAction
            || (window.lastScrolled && new Date().getTime() - window.lastScrolled < TRANSITION_DELAY)
        ) return;

        const { onActiveImageChange, activeImage, children } = this.props;
        const slideCount = children.length;

        if (deltaY < -SCROLL_START_INDEX && activeImage > 0) {
            onActiveImageChange(activeImage - 1);
            this.setAnimationEasing();
            setTimeout(() => this.disableGestures(), 0);
        }

        if (deltaY > SCROLL_START_INDEX && activeImage < slideCount - 1) {
            onActiveImageChange(activeImage + 1);
            this.setAnimationEasing();
            setTimeout(() => this.disableGestures(), 0);
        }
    };

    onClickChangeSlide() {
        const { prevActiveImage } = this.state;

        return -prevActiveImage;
    }

    getFullSliderHeight() {
        const fullSliderHeight = this.draggableRef.current.scrollHeight;
        return fullSliderHeight - this.sliderHeight;
    }

    calculateNextSlide(state) {
        const {
            translateY: translate,
            lastTranslateY: lastTranslate
        } = state;
        const { onActiveImageChange } = this.props;

        const slideSize = this.sliderHeight;

        const fullSliderSize = this.getFullSliderHeight();

        const activeSlidePosition = translate / slideSize;
        const activeSlidePercent = Math.abs(activeSlidePosition % 1);
        const isSlideBack = translate > lastTranslate;

        if (!translate) return this.onClickChangeSlide();

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

    handleDrag = (state) => {
        const { sliderInAction, changeSliderInAction } = this.props;

        if (sliderInAction === HORIZONTAL_INDEX) return;

        if (sliderInAction !== VERTICAL_INDEX
            && Math.abs(state.lastTranslateY + Math.abs(state.translateY)) > 0
            && Math.abs(state.lastTranslateY + Math.abs(state.translateY))
                > Math.abs(state.lastTranslateX + Math.abs(state.translateX))
        ) {
            changeSliderInAction(VERTICAL_INDEX);
        }

        const { translateY } = state;

        const translate = translateY;

        const fullSliderSize = this.getFullSliderHeight();

        if (translate < 0 && translate > -fullSliderSize) {
            CSS.setVariable(
                this.draggableRef,
                'translateY',
                `${ translate }px`
            );
        }
    };

    handleDragEnd = (state, callback) => {
        const { animationDuration, sliderInAction, resetSliderInAction } = this.props;

        if (sliderInAction !== VERTICAL_INDEX) return;

        const {
            translateY,
            lastTranslateY
        } = state;
        const { prevActiveImage } = this.state;

        const activeSlide = this.calculateNextSlide(state);

        // Handle scroll past the end of gallery
        if (translateY < lastTranslateY && prevActiveImage === -activeSlide) {
            document.dispatchEvent(new CustomEvent('openDragbar'));
        }

        const slideSize = this.sliderHeight;

        const newTranslate = activeSlide * slideSize;

        CSS.setVariable(this.draggableRef, 'animation-speed', `${ animationDuration }ms`);
        CSS.setVariable(this.draggableRef, 'translateY', `${ newTranslate }px`);
        CSS.setVariable(this.draggableRef, 'animation-easing', ANIMATION_DRAG_EASING);

        callback({
            originalY: newTranslate,
            lastTranslateY: newTranslate
        });

        resetSliderInAction();
    };

    renderCrumbs() {
        const { children } = this.props;
        if (children.length <= 1) return null;

        return (
            <div
              block="Slider"
              elem="Crumbs"
              mix={ { block: 'SliderVertical', elem: 'Crumbs' } }
            >
                { Children.map(children, this.renderCrumb) }
            </div>
        );
    }

    render() {
        const {
            showCrumbs, mix, activeImage, children
        } = this.props;

        return (
            <div
              block="Slider"
              mix={ mix }
              ref={ this.sliderRef }
            >
                <Draggable
                  mix={ { block: 'Slider', elem: 'Wrapper', mix: { block: 'SliderVertical', elem: 'Wrapper' } } }
                  draggableRef={ this.draggableRef }
                  onDragStart={ this.handleDragStart }
                  onDragEnd={ this.handleDragEnd }
                  onDrag={ this.handleDrag }
                  shiftY={ -activeImage * this.sliderHeight || 0 }
                >
                    { children }
                </Draggable>
                { showCrumbs && this.renderCrumbs() }
            </div>
        );
    }
}
