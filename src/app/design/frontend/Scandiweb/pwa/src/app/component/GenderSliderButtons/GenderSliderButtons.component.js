import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { WOMEN, MEN } from 'Component/GenderSlider/GenderSlider.component';

import './GenderSliderButtons.style';

export default class GenderSliderButtons extends PureComponent {
    static propTypes = {
        changeState: PropTypes.func.isRequired,
        activeHorizontalSlideIndex: PropTypes.number.isRequired
    };

    handleGenderButtonClick(index) {
        const { changeState } = this.props;

        changeState(index);
    }

    renderGenderButton(title, index) {
        const { activeHorizontalSlideIndex } = this.props;

        const isActive = activeHorizontalSlideIndex === index;

        return (
            <button
              block="GenderSliderButtons"
              elem="Button"
              mods={ { isActive } }
              onClick={ () => this.handleGenderButtonClick(index) }
              aria-label={ title }
            >
                { __(title.toUpperCase()) }
            </button>
        );
    }

    render() {
        return (
            <div
              block="GenderSliderButtons"
              elem="Main"
            >
                { this.renderGenderButton('Women', WOMEN) }
                { this.renderGenderButton('Men', MEN) }
            </div>
        );
    }
}
