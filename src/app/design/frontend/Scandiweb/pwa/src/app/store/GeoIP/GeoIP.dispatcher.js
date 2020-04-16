import { showNotification } from 'Store/Notification';
import { updateGeolocation } from 'Store/GeoIP';
import { executePost } from 'Util/Request';
import GeoIPQuery from 'Query/GeoIP.query';
import { prepareQuery } from 'Util/Query';

export class GeoIPDispatcher {
    onSuccess({ getUserLocation }, dispatch) {
        dispatch(updateGeolocation({ isLoading: false, ...getUserLocation }));
    }

    onError([{ message }], dispatch) {
        dispatch(updateGeolocation({ isLoading: false }));
        dispatch(showNotification('error', 'Error fetching post!', message));
    }

    requestIP(dispatch) {
        const query = GeoIPQuery.getQuery();
        dispatch(updateGeolocation({ isLoading: true }));

        return executePost({ ...prepareQuery([query]), cache: 'no-cache' }).then(
            data => this.onSuccess(data, dispatch),
            e => this.onError(e, dispatch)
        );
    }
}

export default new GeoIPDispatcher();
