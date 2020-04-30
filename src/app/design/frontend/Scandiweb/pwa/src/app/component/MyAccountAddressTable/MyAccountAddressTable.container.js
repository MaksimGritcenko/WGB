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
import { connect } from 'react-redux';

import {
    MyAccountAddressTableContainer as SourceMyAccountAddressTableContainer,
    mapStateToProps,
    mapDispatchToProps
} from 'SourceComponent/MyAccountAddressTable/MyAccountAddressTable.container';

export {
    mapStateToProps,
    mapDispatchToProps
};

export class MyAccountAddressTableContainer extends SourceMyAccountAddressTableContainer {
    getFormatedRegion(address = {}) {
        const { countries } = this.props;
        const { country_id, region: rebionObj = {} } = address;
        const { region_id = '', region = '' } = rebionObj || {};

        const country = countries.find(({ id }) => id === country_id);
        if (!country) return {};

        const { label, available_regions } = country;
        const regions = available_regions || [];
        const { name = '' } = regions.find(({ id }) => id === (region_id || '')) || { name: region };

        return {
            country: label,
            region: name
        };
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountAddressTableContainer);
