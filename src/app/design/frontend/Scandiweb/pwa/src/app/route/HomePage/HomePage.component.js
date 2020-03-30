import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GenderSlider from 'Component/GenderSlider';
import SliderVerticalWidget from 'Component/SliderVerticalWidget';
import { backIcon } from 'Component/Header/Header.config';
import { WOMEN, MEN } from 'Component/GenderSlider/GenderSlider.component';

import './HomePage.style.scss';

export const WOMEN_SLIDER_ID = 5;
export const MEN_SLIDER_ID = 6;

export default class HomePage extends PureComponent {
    static propTypes = {
        genderSwitchIndex: PropTypes.number.isRequired,
        changeVerticalSlideIndex: PropTypes.func.isRequired,
        isActiveSlideWhite: PropTypes.bool.isRequired
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);

        this.state = {
            activeSlide: {
                [WOMEN]: 0,
                [MEN]: 0
            },
            slideCount: 0
        };

        this.handleArrowClick = this.handleArrowClick.bind(this);
        this.getSlideCount = this.getSlideCount.bind(this);
    }

    getSlideCount(slideCount) {
        this.setState({ slideCount });
    }

    handleArrowClick() {
        const { genderSwitchIndex, changeVerticalSlideIndex } = this.props;
        const { activeSlide, activeSlide: { [genderSwitchIndex]: activeSlideIndex }, slideCount } = this.state;

        const nextActiveIndex = activeSlideIndex + (slideCount - 1 === activeSlideIndex ? -1 : 1);

        this.setState({
            activeSlide: {
                ...activeSlide,
                [genderSwitchIndex]: nextActiveIndex
            }
        });

        changeVerticalSlideIndex(genderSwitchIndex, nextActiveIndex);
    }

    handleActiveImageChange(activeSlideIndex, sliderIndex) {
        const { changeVerticalSlideIndex } = this.props;
        const { activeSlide } = this.state;

        this.setState({ activeSlide: { ...activeSlide, [sliderIndex]: activeSlideIndex } });
        changeVerticalSlideIndex(sliderIndex, activeSlideIndex);
    }

    renderSlider(sliderId, sliderIndex) {
        const { activeSlide: { [sliderIndex]: activeSlideIndex } } = this.state;

        return (
            <SliderVerticalWidget
              activeImage={ activeSlideIndex }
              sliderId={ sliderId }
              // eslint-disable-next-line react/jsx-no-bind
              onActiveImageChange={ activeSlide => this.handleActiveImageChange(activeSlide, sliderIndex) }
              getSlideCount={ this.getSlideCount }
            />
        );
    }

    renderSlideSwitchArrow() {
        const { genderSwitchIndex, isActiveSlideWhite } = this.props;
        const { activeSlide: { [genderSwitchIndex]: activeSlideIndex }, slideCount } = this.state;

        const mods = {
            isUpside: slideCount && activeSlideIndex + 1 === slideCount,
            isWhite: isActiveSlideWhite
        }

        return (
            <button
              block="HomePage"
              elem="SliderSwitchArrow"
              mods={ mods }
              onClick={ this.handleArrowClick }
            >
                { backIcon }
            </button>
        );
    }

    render() {
        return (
            <div block="HomePage">
                <GenderSlider
                  isGenderSwitcher
                  isBottomSwitcher
                >
                    { this.renderSlider(WOMEN_SLIDER_ID, WOMEN) }
                    { this.renderSlider(MEN_SLIDER_ID, MEN) }
                </GenderSlider>
                { this.renderSlideSwitchArrow() }
            </div>
        );
    }
}
