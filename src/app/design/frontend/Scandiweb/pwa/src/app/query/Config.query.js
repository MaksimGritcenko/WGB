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


    getQuery() {
        return new Field('storeConfig')
            .addFieldList([
                'code',
                'locale',
                'is_active',
                'cms_home_page',
                'cms_no_route',
                'copyright',
                'timezone',
                'header_logo_src',
                'timezone',
                'title_prefix',
                'title_suffix',
                'default_display_currency_code',
                'default_keywords',
                'default_title',
                'default_country',
                'secure_base_media_url',
                'paypal_sandbox_flag',
                'paypal_client_id',
                'logo_alt',
                'cookie_text',
                'cookie_link',
                'terms_are_enabled',
                'base_url',
                'pagination_frame',
                'pagination_frame_skip',
                'anchor_text_for_previous',
                'anchor_text_for_next',
                'demo_notice'
            ]);
    }
}

export default new ConfigQuery();
