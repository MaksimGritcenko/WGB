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

import SourceResetButton from 'SourceComponent/ResetButton/ResetButton.component';
import PropTypes from 'prop-types';
import { MixType } from 'Type/Common';
import './ResetButton.style';

export default class ResetButton extends SourceResetButton {
    render() {
        const { mix, isContentFiltered } = this.props;

        const text = !isContentFiltered ? 'NO' : 'Yes';

        return (
            <div
              block="ResetButton"
              mix={ mix }
            >
                <button
                  onClick={ this.onClick }
                  block="ResetButton"
                  elem="Button"
                  mix={ {
                      block: 'Button',
                      mods: { isHollow: true }
                  } }
                >
                    { text + __('Reset') }
                </button>
            </div>
        );
    }
}
