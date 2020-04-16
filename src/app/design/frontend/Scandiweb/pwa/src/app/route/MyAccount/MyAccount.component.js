import SourceMyAccount from 'SourceRoute/MyAccount/MyAccount.component';
import MyAccountMyReturns from 'Component/MyAccountMyReturns';
import MyAccountNewReturn from 'Component/MyAccountNewReturn';

import { MY_RETURNS, NEW_RETURN } from 'Type/Account';

class MyAccount extends SourceMyAccount {
    renderMap = {
        ...this.renderMap,
        [MY_RETURNS]: MyAccountMyReturns,
        [NEW_RETURN]: MyAccountNewReturn
    };
}

export default MyAccount;
