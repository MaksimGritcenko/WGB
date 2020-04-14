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

import SourceMeta from 'SourceComponent/Meta/Meta.component';

/**
 * Page Meta data
 * @class Meta
 */
export default class Meta extends SourceMeta {
    renderCanonical() {
        const { canonical_url } = this.props;

        if (!canonical_url) return null;

        const canonicalWithoutIndex = canonical_url.replace('index.php/', '');

        return (
            <link rel="canonical" href={ canonicalWithoutIndex } />
        );
    }
}
