import {
    MyAccountOverlayContainer as SourceMyAccountOverlayContainer,
    mapStateToProps as sourceMapStateToProps,
    mapDispatchToProps as sourceMapDispatchToProps
} from 'SourceComponent/MyAccountOverlay/MyAccountOverlay.container';
import { SocialLoginDispatcher } from 'Store/SocialLogins';
import { connect } from 'react-redux';

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
    componentDidUpdate() {
        const {
            isSocialLoginsLoading,
            logins,
            requestLogins
        } = this.props;

        if (isSocialLoginsLoading && !logins.length) {
            requestLogins();
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOverlayContainer);
