import { updateProductDetails } from 'Store/Product';
import { updateNoMatch } from 'Store/NoMatch';
import { LinkedProductsDispatcher } from 'Store/LinkedProducts';
import { ProductDispatcher as SourceProductDispatcher } from 'SourceStore/Product/Product.dispatcher';

export class ProductDispatcher extends SourceProductDispatcher {
    onSuccess(data, dispatch) {
        const {
            products: {
                items,
                is_show_rma_info_pdp: isRmaInfoShowed
            }
        } = data;

        if (!(items && items.length > 0)) return dispatch(updateNoMatch(true));

        const [productItem] = items;
        const product = productItem.type_id === 'grouped'
            ? this._prepareGroupedProduct(productItem) : productItem;

        if (items.length > 0) {
            const product_links = items.reduce((links, product) => {
                const { product_links } = product;

                if (product_links) {
                    Object.values(product_links).forEach((item) => {
                        links.push(item);
                    });
                }

                return links;
            }, []);

            if (product_links.length !== 0) {
                LinkedProductsDispatcher.handleData(dispatch, product_links);
            }
        }

        return dispatch(updateProductDetails(product, isRmaInfoShowed));
    }
}

export default new ProductDispatcher();
