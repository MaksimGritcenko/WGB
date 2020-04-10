import { connect } from 'react-redux';
import { PureComponent } from 'react';
import { resetSliderInAction, changeSliderInAction } from 'Store/Slider';

import Slider from './Slider.component';

export const mapStateToProps = state => ({
    sliderInAction: state.SliderReducer.sliderInAction
});

export const mapDispatchToProps = dispatch => ({
    resetSliderInAction: () => dispatch(resetSliderInAction()),
    changeSliderInAction: index => dispatch(changeSliderInAction(index))
});

export class SliderContainer extends PureComponent {
    render() {
        return (
            <Slider
              { ...this.props }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SliderContainer);
