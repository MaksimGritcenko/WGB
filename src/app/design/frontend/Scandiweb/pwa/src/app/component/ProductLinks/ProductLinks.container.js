import { connect } from 'react-redux';
import Event, { EVENT_GTM_IMPRESSIONS_LINKED } from 'Util/Event';

import {
    ProductLinksContainer as SourceProductLinksContainer,
    mapStateToProps
} from 'SourceComponent/ProductLinks/ProductLinks.container';

export { mapStateToProps };

export class ProductLinksContainer extends SourceProductLinksContainer {
    componentDidUpdate(prevProps) {
        const { areDetailsLoaded } = this.props;
        const { areDetailsLoaded: wereDetailsLoaded } = prevProps;

        if (areDetailsLoaded && wereDetailsLoaded) {
            const { linkType = '', linkedProducts = {} } = this.props;
            const { items = {} } = linkedProducts[linkType] || {};

            if (items.length) {
                Event.dispatch(EVENT_GTM_IMPRESSIONS_LINKED, { items });
            }
        }
    }
}

export default connect(mapStateToProps)(ProductLinksContainer);
