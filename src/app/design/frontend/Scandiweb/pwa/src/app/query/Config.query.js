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

import { ConfigQuery as SourceConfigQuery } from 'SourceQuery/Config.query';
import { Field } from 'Util/Query';

export class ConfigQuery extends SourceConfigQuery {
    getGTMConfiguration() {
        return new Field('getGtm')
            .setAlias('gtm')
            .addFieldList(this._getGTMConfigurationFileds());
    }

    _getGTMConfigurationFileds() {
        return [
            'enabled',
            'gtm_id'
        ];
    }
}

export default new ConfigQuery();
