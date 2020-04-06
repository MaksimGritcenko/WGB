import {
    MyAccountOverlayContainer as SourceMyAccountOverlayContainer,
    mapStateToProps as sourceMapStateToProps,
    mapDispatchToProps as sourceMapDispatchToProps
} from 'SourceComponent/MyAccountOverlay/MyAccountOverlay.container';
import { SocialLoginDispatcher } from 'Store/SocialLogins';
import { connect } from 'react-redux';
import {
    STATE_CREATE_ACCOUNT,
    STATE_LOGGED_IN,
    STATE_SIGN_IN
} from 'Component/MyAccountOverlay/MyAccountOverlay.component';
import { isSignedIn } from 'Util/Auth';
import { history } from 'Route';
import { CUSTOMER_SUB_ACCOUNT } from 'Component/Header';

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
    componentDidMount() {
        const {
            isSocialLoginsLoading,
            logins,
            requestLogins
        } = this.props;

        if (isSocialLoginsLoading && !logins.length) {
            requestLogins();
        }
    }

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

    onVisible() {
        return true;
    }

    handleCreateAccount(e) {
        const { setHeaderState } = this.props;
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({ state: STATE_CREATE_ACCOUNT });

        setHeaderState({
            name: CUSTOMER_SUB_ACCOUNT
        });
    }

    handleSignIn(e) {
        const { setHeaderState } = this.props;
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({ state: STATE_SIGN_IN });

        setHeaderState({
            name: STATE_SIGN_IN
        });
    }

    static getDerivedStateFromProps(props, state) {
        const {
            isSignedIn,
            isPasswordForgotSend,
            showNotification
        } = props;

        const {
            isPasswordForgotSend: currentIsPasswordForgotSend,
            state: myAccountState
        } = state;

        const stateToBeUpdated = {};

        if (myAccountState !== STATE_LOGGED_IN && isSignedIn) {
            stateToBeUpdated.isLoading = false;
            showNotification('success', __('You are successfully logged in!'));
            stateToBeUpdated.state = STATE_LOGGED_IN;
        }

        if (myAccountState === STATE_LOGGED_IN && !isSignedIn) {
            stateToBeUpdated.state = STATE_SIGN_IN;
            showNotification('success', __('You are successfully logged out!'));
            history.push('/');
        }

        if (isPasswordForgotSend !== currentIsPasswordForgotSend) {
            stateToBeUpdated.isLoading = false;
            stateToBeUpdated.isPasswordForgotSend = isPasswordForgotSend;
            // eslint-disable-next-line max-len
            showNotification('success', __('If there is an account associated with the provided address you will receive an email with a link to reset your password.'));
            stateToBeUpdated.state = STATE_SIGN_IN;
        }

        return Object.keys(stateToBeUpdated).length ? stateToBeUpdated : null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOverlayContainer);
