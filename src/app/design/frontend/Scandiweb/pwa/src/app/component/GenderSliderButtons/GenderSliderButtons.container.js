import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { changeState } from 'Store/Slider';
import GenderSliderButtons from './GenderSliderButtons.component';

export const mapStateToProps = state => ({
    activeHorizontalSlideIndex: state.SliderReducer.activeHorizontalSlideIndex
});

export const mapDispatchToProps = dispatch => ({
    changeState: index => dispatch(changeState(index))
});

export class GenderSliderButtonsContainer extends PureComponent {
    render() {
        return (
            <GenderSliderButtons
              { ...this.props }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GenderSliderButtonsContainer);
