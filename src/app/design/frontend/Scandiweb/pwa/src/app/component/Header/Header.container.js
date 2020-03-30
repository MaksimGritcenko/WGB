import { connect } from 'react-redux';

import {
    HeaderContainer as SourceHeaderContainer,
    mapDispatchToProps
} from 'SourceComponent/Header/Header.container';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';

import Header from './Header.component';

export {
    DEFAULT_HEADER_STATE
} from 'SourceComponent/Header/Header.container';

export const mapStateToProps = state => ({
    navigationState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState,
    cartTotals: state.CartReducer.cartTotals,
    header_logo_src: state.ConfigReducer.header_logo_src,
    logo_alt: state.ConfigReducer.logo_alt,
    isLoading: state.ConfigReducer.isLoading,
    isActiveSlideWhite: state.SliderReducer.isActiveSlideWhite,
});

export class HeaderContainer extends SourceHeaderContainer {
    containerProps = () => {
        const {
            navigationState,
            cartTotals,
            header_logo_src,
            logo_alt,
            isLoading,
            isActiveSlideWhite
        } = this.props;

        const {
            isClearEnabled,
            searchCriteria
        } = this.state;

        return {
            navigationState,
            cartTotals,
            header_logo_src,
            logo_alt,
            isLoading,
            isClearEnabled,
            searchCriteria,
            isActiveSlideWhite
        };
    };

    render() {
        return (
            <Header
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
