import { PureComponent } from 'react';
import CmsPage from 'Route/CmsPage';
import GenderSlider from 'Component/GenderSlider';

import './HomePage.style.scss';

export default class HomePage extends PureComponent {
    static propTypes = {
    };

    static defaultProps = {
    };

    render() {
        return (
            <div block="HomePage">
                <GenderSlider
                    isGenderSwitcher
                    isBottomSwitcher
                >
                    <CmsPage { ...this.props } isBreadcrumbsActive={ false } />
                    <CmsPage { ...this.props } isBreadcrumbsActive={ false } />
                </GenderSlider>
            </div>
        )
    }
}
