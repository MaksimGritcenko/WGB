import { QueryDispatcher } from 'Util/Request';
import { SocialLoginQuery } from 'Query';
import { updateSocialLogins } from 'Store/SocialLogins';
import { showNotification } from 'Store/Notification';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';

/**
 * SocialLogin Dispatcher
 * @extends QueryDispatcher
 */
export class SocialLoginDetailsDispatcher extends QueryDispatcher {
    constructor() {
        super('SocialLogin', ONE_MONTH_IN_SECONDS);
    }

    onSuccess(data, dispatch) {
        const { socialLogins } = data;

        dispatch(updateSocialLogins(socialLogins));
    }

    onError([{ message }], dispatch) {
        dispatch(showNotification('error', 'Error fetching Post!', message));
    }

    prepareRequest() {
        return SocialLoginQuery.getQuery();
    }
}

export default new SocialLoginDetailsDispatcher();
