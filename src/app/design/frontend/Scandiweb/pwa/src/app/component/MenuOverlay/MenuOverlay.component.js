import isMobile from 'Util/Mobile';
import Overlay from 'Component/Overlay';
import GenderSlider from 'Component/GenderSlider';
import SourceMenuOverlay, { MENU_OVERLAY_KEY } from 'SourceComponent/MenuOverlay/MenuOverlay.component';

import './MenuOverlay.style';

export { MENU_OVERLAY_KEY };

export default class MenuOverlay extends SourceMenuOverlay {
    render() {
        return (
            <Overlay
              id={ MENU_OVERLAY_KEY }
              mix={ { block: 'MenuOverlay' } }
              onVisible={ this.onVisible }
              isStatic={ !!isMobile.any() }
            >
                <GenderSlider
                    isGenderSwitcher
                >
                    <span>Woman content</span>
                    <span>Men content</span>
                </GenderSlider>
            </Overlay>
        );
    }
}
