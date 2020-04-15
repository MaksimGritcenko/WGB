import { connect } from 'react-redux';
import {
    PopupContainer as SourcePopupContainer,
    mapStateToProps,
    mapDispatchToProps
} from 'SourceComponent/Popup/Popup.container';

import Popup from './Popup.component';

export class PopupContainer extends SourcePopupContainer {
    render() {
        return (
            <Popup
              { ...this.props }
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupContainer);
