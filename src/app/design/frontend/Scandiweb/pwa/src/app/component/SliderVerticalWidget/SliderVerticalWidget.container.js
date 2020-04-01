import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { SliderWidgetContainer } from 'SourceComponent/SliderWidget/SliderWidget.container';
import { SliderQuery } from 'Query';
import { setSlideContentColors } from 'Store/Slider';
import { showNotification } from 'Store/Notification';

import SliderVerticalWidget from './SliderVerticalWidget.component';

export const mapStateToProps = state => ({
    sliderColors: state.SliderReducer.sliderColors
});

export const mapDispatchToProps = dispatch => ({
    showNotification: (type, title, error) => dispatch(showNotification(type, title, error)),
    setSlideContentColors: slider => dispatch(setSlideContentColors(slider))
});

export class SliderVerticalWidgetContainer extends SliderWidgetContainer {
    static propTypes = {
        ...this.propTypes,
        getSliderCount: PropTypes.func,
        sliderId: PropTypes.number.isRequired
    };

    static defaultProps = {
        getSliderCount: () => {}
    };

    requestSlider() {
        const {
            sliderId,
            showNotification,
            getSlideCount,
            setSlideContentColors
        } = this.props;

        this.fetchData(
            [SliderQuery.getQuery({ sliderId })],
            ({ slider }) => {
                this.setState({ slider });

                setSlideContentColors(slider);
                getSlideCount(slider.slides.length);
            },
            e => showNotification('error', 'Error fetching Slider!', e)
        );
    }

    render() {
        return (
            <SliderVerticalWidget
              { ...this.props }
              { ...this.state }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SliderVerticalWidgetContainer);
