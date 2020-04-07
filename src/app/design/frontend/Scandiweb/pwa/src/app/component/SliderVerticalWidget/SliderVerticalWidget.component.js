import SliderVertical from 'Component/SliderVertical';
import { GENDER_SLIDER_ANIMATION_DURATION } from 'Component/GenderSlider/GenderSlider.component';
import SourceSliderWidget from 'SourceComponent/SliderWidget/SliderWidget.component';

export default class SliderVerticalWidget extends SourceSliderWidget {
    componentDidUpdate(prevProps) {
        const { activeImage: prevActiveImage } = prevProps;
        const { activeImage } = this.props;

        if (activeImage !== prevActiveImage) this.updateActiveImage();
    }

    onActiveImageChange = (activeImage) => {
        const { onActiveImageChange } = this.props;

        onActiveImageChange(activeImage);
    };

    updateActiveImage() {
        const { activeImage } = this.props;

        this.setState({ activeImage });
    }

    render() {
        const { activeImage } = this.state;
        const { slider: { slides, title: block }, isScrollEnabled } = this.props;

        return (
            <SliderVertical
              mix={ { block: 'SliderWidget', mix: { block } } }
              showCrumbs
              activeImage={ activeImage }
              onActiveImageChange={ this.onActiveImageChange }
              animationDuration={ GENDER_SLIDER_ANIMATION_DURATION }
              isScrollEnabled={ isScrollEnabled }
            >
                { slides.map(this.renderSlide) }
            </SliderVertical>
        );
    }
}
