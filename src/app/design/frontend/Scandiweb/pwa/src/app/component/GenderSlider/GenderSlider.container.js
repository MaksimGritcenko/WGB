import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { changeState } from 'Store/Slider';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { hideActiveOverlay } from 'Store/Overlay';
import { goToPreviousNavigationState } from 'Store/Navigation';
import GenderSlider from './GenderSlider.component';

export const mapStateToProps = state => ({
    activeHorizontalSlideIndex: state.SliderReducer.activeHorizontalSlideIndex,
    isActiveSlideWhite: state.SliderReducer.isActiveSlideWhite,
    changeState
});

export const mapDispatchToProps = dispatch => ({
    changeState: index => dispatch(changeState(index)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    goToPreviousNavigationState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE))
});

export class GenderSliderContainer extends PureComponent {
    static propTypes = {
        goToPreviousNavigationState: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired
    };

    containerFunctions = {
        onCloseButtonClick: this.onCloseButtonClick.bind(this)
    };

    onCloseButtonClick() {
        const { hideActiveOverlay, goToPreviousNavigationState } = this.props;

        hideActiveOverlay();
        goToPreviousNavigationState();
    }

    render() {
        return (
            <GenderSlider
              { ...this.props }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GenderSliderContainer);
