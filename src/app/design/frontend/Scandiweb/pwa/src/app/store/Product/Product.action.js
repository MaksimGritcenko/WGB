import { UPDATE_PRODUCT_DETAILS } from 'SourceStore/Product/Product.action';

export const updateProductDetails = (product, isRmaInfoShowed) => ({
    type: UPDATE_PRODUCT_DETAILS,
    product,
    isRmaInfoShowed
});

export {
    UPDATE_PRODUCT_DETAILS
} from 'SourceStore/Product/Product.action';
