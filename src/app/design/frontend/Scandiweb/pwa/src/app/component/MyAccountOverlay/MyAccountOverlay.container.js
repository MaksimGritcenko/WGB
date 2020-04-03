import {
    MyAccountOverlayContainer as SourceMyAccountOverlayContainer,
    mapStateToProps as sourceMapStateToProps,
    mapDispatchToProps as sourceMapDispatchToProps
} from 'SourceComponent/MyAccountOverlay/MyAccountOverlay.container';
import { SocialLoginDispatcher } from 'Store/SocialLogins';
import { connect } from 'react-redux';
import { STATE_LOGGED_IN } from "Component/MyAccountOverlay/MyAccountOverlay.component";
import { isSignedIn } from 'Util/Auth';
import { history } from 'Route';


const mapStateToProps = state => ({
    ...sourceMapStateToProps(state),
    logins: state.SocialLoginReducer.logins,
    isSocialLoginsLoading: state.SocialLoginReducer.isLoading

});

const mapDispatchToProps = dispatch => ({
    ...sourceMapDispatchToProps(dispatch),
    requestLogins: () => SocialLoginDispatcher.handleData(dispatch)
});

class MyAccountOverlayContainer extends SourceMyAccountOverlayContainer {
    componentDidUpdate(_, prevState) {
        const { state: oldMyAccountState } = prevState;
        const { state: newMyAccountState } = this.state;
        const { hideActiveOverlay } = this.props;
        const currentPage = window.location.pathname;
        const {
            isSocialLoginsLoading,
            logins,
            requestLogins
        } = this.props;

        if (isSocialLoginsLoading && !logins.length) {
            requestLogins();
        }

        if (oldMyAccountState === newMyAccountState) return;

        if (isSignedIn()) hideActiveOverlay();

        if (currentPage !== '/checkout' && newMyAccountState === STATE_LOGGED_IN) {
            history.push({ pathname: '/my-account/dashboard' });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOverlayContainer);
