import { Field } from 'Util/Query';

export class SocialLoginQuery {
    getQuery() {
        return new Field('socialLogins')
            .addField('url')
            .addField('provider');
    }
}
export default new SocialLoginQuery();
