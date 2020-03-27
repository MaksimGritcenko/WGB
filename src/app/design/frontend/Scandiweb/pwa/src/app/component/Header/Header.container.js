import { connect } from 'react-redux';
import { HeaderContainer as SourceHeaderContainer } from 'SourceComponent/Header/Header.container';
import { mapStateToProps, mapDispatchToProps, DEFAULT_HEADER_STATE } from 'SourceComponent/Header/Header.container';
import { DRAGBAR_OPEN } from 'Component/Header/Header.component';

class HeaderContainer extends SourceHeaderContainer {
    handleMobileUrlChange(history) {
        const { navigationState: { name } } = this.props;
        const { prevPathname } = this.state;
        const { pathname } = history;
        const isClearEnabled = this.getIsClearEnabled();

        // handle dragbar update on select option
        if (name === DRAGBAR_OPEN && (prevPathname === pathname || !prevPathname)) {
            return {}
        }

        if (prevPathname === pathname) {
            return { isClearEnabled };
        }

        return {
            isClearEnabled,
            ...this.handleMobileRouteChange(history)
        };
    }
}

export { mapStateToProps, mapDispatchToProps, DEFAULT_HEADER_STATE };
export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
