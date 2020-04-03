import { Field } from 'Util/Query';
import { MyAccountQuery as SourceMyAccountQuery } from 'SourceQuery/MyAccount.query';

export class MyAccountQuery extends SourceMyAccountQuery {
    getLogoutMutation() {
        return new Field('logout')
            .addField('status');
    }
}
export default new MyAccountQuery();
