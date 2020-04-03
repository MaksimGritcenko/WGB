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

import { ConfigQuery } from 'Query';
import { ConfigDispatcher as SourceConfigDispatcher } from 'SourceStore/Config/Config.dispatcher';

export class ConfigDispatcher extends SourceConfigDispatcher {
    prepareRequest() {
        return [
            ...super.prepareRequest(),
            ConfigQuery.getGTMConfiguration()
        ];
    }
}

export default new ConfigDispatcher();
