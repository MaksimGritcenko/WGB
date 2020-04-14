export const UPDATE_GEOLOCATION = 'UPDATE_GEOLOCATION';
export const UPDATE_IP = 'UPDATE_IP';

/**
 * Retrieve location from GeoIP
 * @param {Object} data
 */
export const updateGeolocation = data => ({
    type: UPDATE_GEOLOCATION,
    data
});
