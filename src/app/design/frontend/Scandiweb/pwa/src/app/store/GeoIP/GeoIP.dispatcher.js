import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';
import { showNotification } from 'Store/Notification';
import { QueryDispatcher } from 'Util/Request';
import GeoIPQuery from 'Query/GeoIP.query';
import { updateGeolocation } from 'Store/GeoIP';
import publicIp from 'public-ip';

export class GeoIPDispatcher extends QueryDispatcher {
    constructor() {
        super('GeoIP', ONE_MONTH_IN_SECONDS);
    }

    onSuccess({ getLocationByIp }, dispatch) {
        dispatch(updateGeolocation({ isLoading: false }));
        dispatch(updateGeolocation(getLocationByIp));
    }

    onError([{ message }], dispatch) {
        dispatch(updateGeolocation({ isLoading: false }));
        dispatch(showNotification('error', 'Error fetching post!', message));
    }

    async handleData(dispatch, options) {
        dispatch(updateGeolocation({ isLoading: true }));
        try {
            this.userIp = await publicIp.v4();
        } catch (error) {
            dispatch(updateGeolocation({ isLoading: false, error: true }));
            return;
        }
        super.handleData(dispatch, options);
    }

    prepareRequest() {
        return GeoIPQuery.getQuery(this.userIp);
    }
}

export default new GeoIPDispatcher();
