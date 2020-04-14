import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';
import { showNotification } from 'Store/Notification';
import { QueryDispatcher } from 'Util/Request';
import GeoIPQuery from 'Query/GeoIP.query';
import { updateGeolocation } from 'Store/GeoIP';

export class GeoIPDispatcher extends QueryDispatcher {
    constructor() {
        super('GeoIP', ONE_MONTH_IN_SECONDS);
    }

    onSuccess({ getUserLocation }, dispatch) {
        dispatch(updateGeolocation({ isLoading: false, ...getUserLocation }));
    }

    onError([{ message }], dispatch) {
        dispatch(updateGeolocation({ isLoading: false }));
        dispatch(showNotification('error', 'Error fetching post!', message));
    }

    async handleData(dispatch, options) {
        dispatch(updateGeolocation({ isLoading: true }));
        super.handleData(dispatch, options);
    }

    prepareRequest() {
        return GeoIPQuery.getQuery();
    }
}

export default new GeoIPDispatcher();
