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

import './Loader.style';
import SourceLoader from 'SourceComponent/Loader/Loader.component';
import img from './scandipwa_favicon.png';

/**
 * Loader component
 * Loaders overlay to identify loading
 * @class Loader
 */
export default class Loader extends SourceLoader {
    render() {
        const { isLoading } = this.props;

        if (!isLoading) return null;

        return (
            <div block="Loader" elem="LoaderWrapper">
                <div block="Loader" elem="Main">
                    <img block="Loader" elem="Image" src={ img } alt="VGB loader" />
                </div>
            </div>
        );
    }
}
