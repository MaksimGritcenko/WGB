import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Slider from 'Component/Slider';
import './GenderSlider.style';

import { closeIcon } from 'Component/Header/Header.config';

export const WOMEN = 0;
export const MEN = 1;

export default class GenderSlider extends PureComponent {
    static propTypes = {
        children: PropTypes.array.isRequired,
        isBottomSwitcher: PropTypes.bool,
        onCloseButtonClick: PropTypes.func.isRequired,
        activeStateIndex: PropTypes.number.isRequired,
        changeState: PropTypes.func.isRequired
    };

    static defaultProps = {
        isBottomSwitcher: false
    };

    constructor(props) {
        super(props);

        this.state = {
            activeImageIndex: WOMEN
        };
    }

    componentDidUpdate(prevState) {
        const { activeStateIndex: prevactiveStateIndex } = prevState;
        const { activeStateIndex } = this.props;

        if (prevactiveStateIndex !== activeStateIndex) {
            this.updateActiveImageIndex(activeStateIndex);
        }
    }

    handleSlideChange = (index) => {
        this.handleGenderSwitch(index);
    };

    handleGenderSwitch(activeImageIndex) {
        const { changeState } = this.props;

        this.setState({ activeImageIndex });
        changeState(activeImageIndex);
    }

    updateActiveImageIndex(activeImageIndex) {
        this.setState({ activeImageIndex });
    }

    renderCloseButton() {
        const { onCloseButtonClick, isBottomSwitcher } = this.props;

        if (isBottomSwitcher) return null;

        return (
            <button
              block="Header"
              elem="Button"
              mods={ { type: 'close' } }
              mix={ { block: 'GenderSlider', mods: { button: 'close' } } }
              onClick={ onCloseButtonClick }
              aria-label="Close"
            >
                { closeIcon }
            </button>
        );
    }

    renderButton(title, index) {
        const { activeImageIndex } = this.state;
        const { isBottomSwitcher } = this.props;

        const mods = isBottomSwitcher ? { isBottom: true, isActive: activeImageIndex === index } : {};
        const mix = !isBottomSwitcher ? { block: 'Button', mods: { isHollow: activeImageIndex !== index } } : {};

        return (
            <button
              block="GenderSlider"
              elem="GenderButton"
              mix={ mix }
              mods={ mods }
              onClick={ () => this.handleGenderSwitch(index) }
              aria-label={ title }
            >
                { __(title.toUpperCase()) }
            </button>
        );
    }

    renderGenderSwitcher() {
        const { isBottomSwitcher } = this.props;

        return (
            <div
              block="GenderSlider"
              elem="GenderSwitcher"
              mods={ { isBottom: isBottomSwitcher } }
            >
                { this.renderButton('Woman', WOMEN) }
                { this.renderButton('Men', MEN) }
                { this.renderCloseButton() }
            </div>
        );
    }

    renderSlide(slideContent, index) {
        return (
            <div
              key={ index }
              block="GenderSlider"
              elem="Slide"
            >
                { slideContent }
            </div>
        );
    }

    render() {
        const { children } = this.props;
        const { activeImageIndex } = this.state;

        return (
            <div
              block="GenderSlider"
              elem="Main"
            >
                { this.renderGenderSwitcher() }
                <Slider
                  mix={ { block: 'GenderSlider', elem: 'Slider' } }
                  onActiveImageChange={ this.handleSlideChange }
                  activeImage={ activeImageIndex }
                >
                    { children.map(this.renderSlide) }
                </Slider>
            </div>
        );
    }
}
