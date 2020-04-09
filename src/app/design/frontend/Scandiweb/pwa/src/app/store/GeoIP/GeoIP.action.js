export const UPDATE_GEOLOCATION = 'UPDATE_GEOLOCATION';

/**
 * Retrieve location from GeoIP
 * @param {Object} data
 */
export const updateGeolocation = data => ({
    type: UPDATE_GEOLOCATION,
    data
});
