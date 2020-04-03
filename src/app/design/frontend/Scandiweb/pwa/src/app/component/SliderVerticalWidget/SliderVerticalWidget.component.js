import SliderVertical from 'Component/SliderVertical';
import SourceSliderWidget from 'SourceComponent/SliderWidget/SliderWidget.component';

export default class SliderVerticalWidget extends SourceSliderWidget {
    componentDidUpdate(prevProps) {
        const { activeImage: prevActiveImage } = prevProps;
        const { activeImage } = this.props;

        if (activeImage !== prevActiveImage) this.updateActiveImage();
    }

    onActiveImageChange = (activeImage) => {
        const { onActiveImageChange } = this.props;

        this.setState({ activeImage });
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
              animationDuration={ 1000 }
              isScrollEnabled={ isScrollEnabled }
            >
                { slides.map(this.renderSlide) }
            </SliderVertical>
        );
    }
}
