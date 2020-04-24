
import { initialState as sourceInitialState } from 'SourceStore/Product/Product.reducer';
import { getIndexedProduct } from 'Util/Product';
import { UPDATE_PRODUCT_DETAILS } from './Product.action';

export const initialState = {
    ...sourceInitialState,
    isRmaInfoShowed: false
};

const ProductReducer = (state = initialState, action) => {
    switch (action.type) {
    case UPDATE_PRODUCT_DETAILS:
        const { product, isRmaInfoShowed } = action;

        return {
            ...state,
            product: getIndexedProduct(product),
            isRmaInfoShowed
        };

    default:
        return state;
    }
};

export {
    formatConfigurableOptions
} from 'SourceStore/Product/Product.reducer';

export default ProductReducer;
