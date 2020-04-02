/* eslint-disable fp/no-let */

/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

/**
 * Convert object with key value pairs to url query string
 * @param {Object} keyValuePairs object with key value pairs
 * @return {String} Converted query string
 */
export const convertKeyValuesToQueryString = (keyValuePairs) => {
    let newSearchQuery = '';

    Object.entries(keyValuePairs).forEach((pair) => {
        const [key, value] = pair;
        const keyExists = key !== '';
        const valueExists = typeof value === 'object' ? value.length : value !== '';

        if (valueExists && keyExists) {
            newSearchQuery += `${key}=${value}&`;
        }
    });

    return `${newSearchQuery.slice(0, -1)}`; // remove trailing '&'
};

export {
    getUrlParam,
    getQueryParam,
    generateQuery,
    setQueryParams,
    clearQueriesFromUrl,
    updateQueryParamWithoutHistory,
    removeQueryParamWithoutHistory,
    convertQueryStringToKeyValuePairs,
    objectToUri
} from 'SourceUtil/Url/Url';
