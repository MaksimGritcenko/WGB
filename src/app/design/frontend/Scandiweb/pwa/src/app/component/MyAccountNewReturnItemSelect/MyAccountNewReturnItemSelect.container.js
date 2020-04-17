import DataContainer from 'Util/Request/DataContainer';
import MyAccountNewReturnItemSelect from './MyAccountNewReturnItemSelect.component';

export class MyAccountNewReturnItemSelectContainer extends DataContainer {
    containerFunctions = {
        getCurrentProduct: this.getCurrentProduct.bind(this)
    };

    getCurrentProduct() {
        const { item: { product } } = this.props;
        const variantIndex = this._getVariantIndex();

        return variantIndex < 0
            ? product
            : product.variants[variantIndex];
    }

    render() {
        return (
            <MyAccountNewReturnItemSelect
              { ...this.props }
              { ...this.containerFunctions }
            />
        );
    }
}

export default MyAccountNewReturnItemSelectContainer;
