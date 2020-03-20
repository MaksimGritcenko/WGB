import React from 'react';
import { connect } from 'react-redux';
import {
    AppRouter as SourceAppRouter,
    mapDispatchToProps,
    mapStateToProps,
    history,
    BEFORE_ITEMS_TYPE
} from 'SourceRoute';

import Breadcrumbs from 'Component/Breadcrumbs';
import Header from 'Component/Header';
import NotificationList from 'Component/NotificationList';

class AppRouter extends SourceAppRouter {
    [BEFORE_ITEMS_TYPE] = [
        {
            component: <NotificationList />,
            position: 10
        },
        {
            component: <Header />,
            position: 20
        },
        {
            component: <Breadcrumbs />,
            position: 30
        }
    ];
}

export { history };

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
