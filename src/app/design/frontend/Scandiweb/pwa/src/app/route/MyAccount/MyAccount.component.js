import SourceMyAccount from 'SourceRoute/MyAccount/MyAccount.component';
import MyAccountMyReturns from 'Component/MyAccountMyReturns';
import ContentWrapper from 'Component/ContentWrapper';
import MyAccountTabList from 'Component/MyAccountTabList';

import { MY_RETURNS } from 'Type/Account';

class MyAccount extends SourceMyAccount {
    renderMap = {
        ...this.renderMap,
        [MY_RETURNS]: MyAccountMyReturns
    };

    isTabListNotActive() {
        return false;
    }

    renderContent() {
        const {
            activeTab,
            tabMap,
            changeActiveTab,
            isSignedIn,
            onSignOut,
            history
        } = this.props;

        if (!isSignedIn) {
            return this.renderLoginOverlay();
        }

        const TabContent = this.renderMap[activeTab];
        const { name, noTitle } = tabMap[activeTab];

        return (
            <ContentWrapper
              label={ __('My Account page') }
              wrapperMix={ { block: 'MyAccount', elem: 'Wrapper' } }
            >
                <div
                  block="MyAccount"
                  elem="TabList"
                  mods={ { isNotActive: this.isTabListNotActive() } }
                >
                    <MyAccountTabList
                      tabMap={ tabMap }
                      activeTab={ activeTab }
                      changeActiveTab={ changeActiveTab }
                      onSignOut={ onSignOut }
                    />
                </div>
                <div block="MyAccount" elem="TabContent">
                    { !noTitle && <h1 block="MyAccount" elem="Heading">{ name }</h1> }
                    <TabContent history={ history } />
                </div>
            </ContentWrapper>
        );
    }
}

export default MyAccount;
