// importing the necessary module to implement the "default export"
import { connect } from 'react-redux';
import { lazy } from 'react';
import { Route } from 'react-router-dom';

// importing all parts of original header planned to modify
import {
    SWITCH_ITEMS_TYPE,
    mapStateToProps,
    mapDispatchToProps,
    AppRouter as SourceAppRouter
} from 'SourceRoute';

// export all unmodified exports from original file
export {
    CartPage,
    CategoryPage,
    Checkout,
    CmsPage,
    HomePage,
    MyAccount,
    NoMatchHandler,
    PasswordChangePage,
    ProductPage,
    SearchPage,
    SomethingWentWrong,
    UrlRewrites,
    MenuPage,
    BEFORE_ITEMS_TYPE,
    AFTER_ITEMS_TYPE,
    history
} from 'SourceRoute';

export const StyleGuide = lazy(() => import(/* webpackMode: "lazy", webpackPrefetch: true */ 'Route/StyleGuide'));

// modify the intended part of the logic, notice, the class is also exported!
export class AppRouter extends SourceAppRouter {
    constructor(props) {
        super(props);

        this[SWITCH_ITEMS_TYPE].push(
            {
                component: <Route path="/styleguide" exact component={ StyleGuide } />,
                position: 11
            }
        );
    }
}

// preserve the default export
export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
