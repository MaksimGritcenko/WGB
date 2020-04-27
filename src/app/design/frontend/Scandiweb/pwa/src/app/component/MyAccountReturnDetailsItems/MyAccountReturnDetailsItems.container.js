import {
    MyAccountNewReturnItemSelectContainer as SourceMyAccountNewReturnItemSelectContainer
} from 'Component/MyAccountNewReturnItemSelect/MyAccountNewReturnItemSelect.container';

import MyAccountReturnDetailsItems from './MyAccountReturnDetailsItems.component';

export class MyAccountNewReturnItemSelectContainer extends SourceMyAccountNewReturnItemSelectContainer {
    render() {
        return (
            <MyAccountReturnDetailsItems
              { ...this.props }
              { ...this.containerFunctions }
            />
        );
    }
}

export default MyAccountNewReturnItemSelectContainer;
