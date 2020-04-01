import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { changeVerticalSlideIndex } from 'Store/Slider';
import HomePage from './HomePage.component';

export const mapStateToProps = state => ({
    urlKey: state.ConfigReducer.cms_home_page,
    genderSwitchIndex: state.SliderReducer.activeHorizontalSlideIndex,
    isActiveSlideWhite: state.SliderReducer.isActiveSlideWhite
});

export const mapDispatchToProps = dispatch => ({
    changeVerticalSlideIndex: (horizontalIndex, verticalIndex) => dispatch(changeVerticalSlideIndex(horizontalIndex, verticalIndex)),
});

export class HomePageContainer extends PureComponent {
    render() {
        return (
            <HomePage
              { ...this.props }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePageContainer);
