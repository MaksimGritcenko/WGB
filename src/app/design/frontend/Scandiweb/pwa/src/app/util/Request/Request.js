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

import { getAuthorizationToken } from 'Util/Auth';

export * from 'SourceUtil/Request/Request';

const GRAPHQL_URI = '/graphql';

/**
 * Append authorization token to header object
 * @param {Object} headers
 * @returns {Object} Headers with appended authorization
 */
const appendTokenToHeaders = (headers) => {
    const token = getAuthorizationToken();

    return {
        ...headers,
        Authorization: token ? `Bearer ${token}` : ''
    };
};

/**
 *
 * @param {String} graphQlURI
 * @param {String} queryObject
 * @param {String} name
 * @returns {Promise<Response>}
 */
const postFetch = (graphQlURI, query, variables, cache = 'default') => fetch(graphQlURI,
    {
        method: 'POST',
        body: JSON.stringify({ query, variables }),
        headers: appendTokenToHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }),
        cache
    });

/**
 * Checks for errors in response, if they exist, rejects promise
 * @param  {Object} res Response from GraphQL endpoint
 * @return {Promise<Object>} Handled GraphqlQL results promise
 */
const checkForErrors = res => new Promise((resolve, reject) => {
    const { errors, data } = res;
    return errors ? reject(errors) : resolve(data);
});

/**
 * Handle connection errors
 * @param  {any} err Error from fetch
 * @return {void} Simply console error
 */
// eslint-disable-next-line no-console
const handleConnectionError = err => console.error(err);

/**
 * Parse response and check wether it contains errors
 * @param  {{}} queryObject prepared with `prepareDocument()` from `Util/Query` request body object
 * @return {Promise<Request>} Fetch promise to GraphQL endpoint
 */
const parseResponse = promise => new Promise((resolve, reject) => {
    promise.then(
        res => res.json().then(
            res => resolve(checkForErrors(res)),
            () => handleConnectionError('Can not transform JSON!') && reject()
        ),
        err => handleConnectionError('Can not establish connection!') && reject(err)
    );
});

/**
 * Make POST request to endpoint
 * @param  {{}} queryObject prepared with `prepareDocument()` from `Util/Query` request body object
 * @return {Promise<Request>} Fetch promise to GraphQL endpoint
 */
export const executePost = (queryObject) => {
    const { query, variables, cache = 'default' } = queryObject;
    return parseResponse(postFetch(GRAPHQL_URI, query, variables, cache));
};
