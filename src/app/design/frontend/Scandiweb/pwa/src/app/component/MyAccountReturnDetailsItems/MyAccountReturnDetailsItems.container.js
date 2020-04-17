import { connect } from 'react-redux';
import {
    MyAccountNewReturnItemSelectContainer as SourceMyAccountNewReturnItemSelectContainer,
    mapStateToProps,
    mapDispatchToProps
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

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountNewReturnItemSelectContainer);
