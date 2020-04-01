import {
    MyAccountContainer,
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps as sourceMapStateToProps
} from 'SourceRoute/MyAccount/MyAccount.container';
import { setAuthorizationToken, getAuthorizationToken } from 'Util/Auth';
import { convertQueryStringToKeyValuePairs } from 'Util/Url';
import { updateCustomerSignInStatus } from 'Store/MyAccount';
import { connect } from 'react-redux';
import { DASHBOARD } from 'Type/Account';
import isMobile from 'Util/Mobile';


export const MY_ACCOUNT_URL = '/my-account';

export const mapDispatchToProps = dispatch => ({
    ...sourceMapDispatchToProps(dispatch),
    updateIsSignedIn: state => dispatch(updateCustomerSignInStatus(state))
});

const mapStateToProps = state => ({
    ...sourceMapStateToProps(state)
});

class MyAccount extends MyAccountContainer {
    constructor(props) {
        super(props);
        this.updateBreadcrumbs();
    }

    updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const { activeTab } = this.state;
        if (!this.tabMap[activeTab]) return;
        const { url, name } = this.tabMap[activeTab];

        updateBreadcrumbs([
            { url: `${ MY_ACCOUNT_URL }${ url }`, name },
            { name: __('My Account'), url: `${ MY_ACCOUNT_URL }/${ DASHBOARD }` }
        ]);
    }

    redirectIfNotSignedIn() {
        const {
            isSignedIn, history: { location: { search } }, history, updateIsSignedIn
        } = this.props;
        const { token } = convertQueryStringToKeyValuePairs(search);
        if (token) {
            setAuthorizationToken(token);
            updateIsSignedIn(true);
            history.replace(`${ MY_ACCOUNT_URL }`);
        }

        if (!isSignedIn && !getAuthorizationToken()) {
            history.push('/');
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
