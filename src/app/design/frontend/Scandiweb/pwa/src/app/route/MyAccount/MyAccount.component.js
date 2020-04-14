import SourceMyAccount from 'SourceRoute/MyAccount/MyAccount.component';
import MyAccountMyReturns from 'Component/MyAccountMyReturns';

import { MY_RETURNS } from './MyAccount.container';

class MyAccount extends SourceMyAccount {
    renderMap = {
        ...this.renderMap,
        [MY_RETURNS]: MyAccountMyReturns
    };
}

export default MyAccount;
