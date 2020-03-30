import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { SliderWidgetContainer, mapDispatchToProps } from 'SourceComponent/SliderWidget/SliderWidget.container';
import { SliderQuery } from 'Query';

import SliderVerticalWidget from './SliderVerticalWidget.component';

export class SliderVerticalWidgetContainer extends SliderWidgetContainer {
    static propTypes = {
        ...this.propTypes,
        getSliderCount: PropTypes.func
    };

    static defaultProps = {
        getSliderCount: () => {}
    };

    requestSlider() {
        const { sliderId, showNotification, getSlideCount } = this.props;

        this.fetchData(
            [SliderQuery.getQuery({ sliderId })],
            ({ slider }) => {
                this.setState({ slider });

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

export default connect(null, mapDispatchToProps)(SliderVerticalWidgetContainer);
