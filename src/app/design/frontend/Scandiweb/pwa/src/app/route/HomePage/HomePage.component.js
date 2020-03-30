import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GenderSlider from 'Component/GenderSlider';
import SliderVerticalWidget from 'Component/SliderVerticalWidget';
import { backIcon } from 'Component/Header/Header.config';
import { WOMEN, MEN } from 'Component/GenderSlider/GenderSlider.component';

import './HomePage.style.scss';

const WOMEN_SLIDER_ID = 5;
const MEN_SLIDER_ID = 6;

export default class HomePage extends PureComponent {
    static propTypes = {
        genderSwitchIndex: PropTypes.number.isRequired
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
        const { genderSwitchIndex } = this.props;
        const { activeSlide, activeSlide: { [genderSwitchIndex]: activeSlideIndex }, slideCount } = this.state;

        this.setState({
            activeSlide: {
                ...activeSlide,
                [genderSwitchIndex]: activeSlideIndex + (slideCount - 1 === activeSlideIndex ? -1 : 1)
            }
        });
    }

    handleActiveImageChange(activeSlideIndex, sliderIndex) {
        const { activeSlide } = this.state;

        this.setState({ activeSlide: { ...activeSlide, [sliderIndex]: activeSlideIndex } });
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
        const { genderSwitchIndex } = this.props;
        const { activeSlide: { [genderSwitchIndex]: activeSlideIndex }, slideCount } = this.state;

        return (
            <button
              block="HomePage"
              elem="SliderSwitchArrow"
              mods={ { isUpside: slideCount && activeSlideIndex + 1 === slideCount } }
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
