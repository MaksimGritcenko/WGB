import { connect } from 'react-redux';
import {
    mapStateToProps,
    mapDispatchToProps,
    SliderContainer
} from 'Component/Slider/Slider.container';

import SliderVertical from './SliderVertical.component';

export class SliderVerticalContainer extends SliderContainer {
    render() {
        return (
            <SliderVertical
              { ...this.props }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SliderVerticalContainer);
