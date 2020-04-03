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
import { withRouter } from 'react-router-dom';

import { SEARCH } from 'Component/Header/Header.component';

import {
    NoMatchHandlerContainer as SourceNoMatchHandlerContainer,
    mapDispatchToProps,
    mapStateToProps
} from 'SourceRoute/NoMatchHandler/NoMatchHandler.container';

export { mapStateToProps, mapDispatchToProps };

export class NoMatchHandlerContainer extends SourceNoMatchHandlerContainer {
    componentDidMount() {
        const { location: { pathname }, history } = this.props;

        if (pathname === `/${ SEARCH }` || pathname === `/${ SEARCH }/`) {
            history.push('/');
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NoMatchHandlerContainer));
