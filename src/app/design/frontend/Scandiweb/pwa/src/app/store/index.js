import {
    createStore, combineReducers
} from 'redux';

import { reducers as SourceReducers } from 'SourceStore/index';
import { SliderReducer } from 'Store/Slider';
import { HeaderAndFooterReducer } from 'Store/HeaderAndFooter';
import { SocialLoginReducer } from 'Store/SocialLogins';
import { ContactFormReducer } from 'Store/ContactForm';
import { StoreFinderReducer } from 'Store/StoreFinder';

export const reducers = {
    ...SourceReducers,
    SliderReducer,
    HeaderAndFooterReducer,
    SocialLoginReducer,
    ContactFormReducer,
    StoreFinderReducer
};

const store = createStore(
    combineReducers(reducers),
    ( // enable Redux dev-tools only in development
        process.env.NODE_ENV === 'development'
        && window.__REDUX_DEVTOOLS_EXTENSION__
    ) && window.__REDUX_DEVTOOLS_EXTENSION__({
        trace: true
    })
);

export default store;
