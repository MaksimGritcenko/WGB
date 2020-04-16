import { connect } from 'react-redux';
import { customerType } from 'Type/Account';
import DataContainer from 'Util/Request/DataContainer';
import MyAccountNewReturnItemSelect from './MyAccountNewReturnItemSelect.component';

const ITEMS = {"data":{"getOrderById":{"base_order_info":{"id":7,"increment_id":"000000007","created_at":"2020-04-15 07:20:45","status_label":"Pending","grand_total":582.81,"sub_total":557.81},"payment_info":{"method":"checkmo","additional_information":{"bank":null,"method_title":"Check \/ Money order","credit_type":null,"month":null,"customer_info":null}},"shipping_info":{"shipping_method":"flatrate_flatrate","shipping_description":"Flat Rate - Fixed","shipping_amount":25,"tracking_numbers":[],"shipping_address":{"city":"Riga","company":null,"firstname":"Rob","lastname":"Brie","middlename":null,"telephone":"12312312","district":null,"house_number":null,"apartment_number":null,"postomat_code":null,"store_pickup_code":null,"post_office_code":null,"postcode":"9991LV","street":"123 street","is_b2b":null,"region":"Alabama","organizationname":null,"organizationbin":null,"organizationaddress":null,"organizationiic":null,"organizationbik":null}},"order_products":[{"id":2017,"name":"Brax Chuck Slim Fit","short_description":{"html":"<p><span data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;High-waist, wide-leg trousers with front pockets, welt pockets in the back and metal zip, inside button and hook fastening in the front.&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:769,&quot;3&quot;:{&quot;1&quot;:0},&quot;11&quot;:4,&quot;12&quot;:0}\">High-waist, wide-leg trousers with front pockets, welt pockets in the back and metal zip, inside button and hook fastening in the front.<\/span><\/p>"},"sku":"n30977134","qty":2,"row_total":223.13,"original_price":105,"license_key":null,"thumbnail":{"url":"https:\/\/scandipwa.local\/media\/catalog\/product\/cache\/f3666ac803477544fb5c35456ad45e8e\/1\/_\/1_1.png","label":"Brax Chuck Slim Fit","path":"\/1\/_\/1_1.png"},"small_image":{"url":"https:\/\/scandipwa.local\/media\/catalog\/product\/cache\/e241865859fde6bfcba83302a97ec130\/1\/_\/1_1.png","label":"Brax Chuck Slim Fit","path":"\/1\/_\/1_1.png"},"attributes":[{"attribute_value":null,"attribute_code":"size","attribute_type":"select","attribute_label":"Size","attribute_options":[{"label":"Extra small size","value":"77","swatch_data":{"value":"XS"}},{"label":"Small size","value":"78","swatch_data":{"value":"S"}},{"label":"Medium size","value":"79","swatch_data":{"value":"M"}},{"label":"Large size","value":"80","swatch_data":{"value":"L"}},{"label":"Extra large size","value":"81","swatch_data":{"value":"XL"}}]},{"attribute_value":null,"attribute_code":"color","attribute_type":"select","attribute_label":"Color","attribute_options":[{"label":"Brown","value":"71","swatch_data":{"value":"#795548"}},{"label":"White","value":"72","swatch_data":{"value":"#ffffff"}},{"label":"Black","value":"73","swatch_data":{"value":"#1b1b1b"}},{"label":"Grey","value":"74","swatch_data":{"value":"#b1adad"}},{"label":"Blue","value":"75","swatch_data":{"value":"#3f51b5"}},{"label":"Red","value":"76","swatch_data":{"value":"#f44336"}}]},{"attribute_value":"Cotton","attribute_code":"material","attribute_type":"text","attribute_label":"Material","attribute_options":[]}]},{"id":2017,"name":"Brax Chuck Slim Fit","short_description":{"html":"<p><span data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;High-waist, wide-leg trousers with front pockets, welt pockets in the back and metal zip, inside button and hook fastening in the front.&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:769,&quot;3&quot;:{&quot;1&quot;:0},&quot;11&quot;:4,&quot;12&quot;:0}\">High-waist, wide-leg trousers with front pockets, welt pockets in the back and metal zip, inside button and hook fastening in the front.<\/span><\/p>"},"sku":"n30977134","qty":3,"row_total":334.68,"original_price":105,"license_key":null,"thumbnail":{"url":"https:\/\/scandipwa.local\/media\/catalog\/product\/cache\/f3666ac803477544fb5c35456ad45e8e\/1\/_\/1_1.png","label":"Brax Chuck Slim Fit","path":"\/1\/_\/1_1.png"},"small_image":{"url":"https:\/\/scandipwa.local\/media\/catalog\/product\/cache\/e241865859fde6bfcba83302a97ec130\/1\/_\/1_1.png","label":"Brax Chuck Slim Fit","path":"\/1\/_\/1_1.png"},"attributes":[{"attribute_value":null,"attribute_code":"size","attribute_type":"select","attribute_label":"Size","attribute_options":[{"label":"Extra small size","value":"77","swatch_data":{"value":"XS"}},{"label":"Small size","value":"78","swatch_data":{"value":"S"}},{"label":"Medium size","value":"79","swatch_data":{"value":"M"}},{"label":"Large size","value":"80","swatch_data":{"value":"L"}},{"label":"Extra large size","value":"81","swatch_data":{"value":"XL"}}]},{"attribute_value":null,"attribute_code":"color","attribute_type":"select","attribute_label":"Color","attribute_options":[{"label":"Brown","value":"71","swatch_data":{"value":"#795548"}},{"label":"White","value":"72","swatch_data":{"value":"#ffffff"}},{"label":"Black","value":"73","swatch_data":{"value":"#1b1b1b"}},{"label":"Grey","value":"74","swatch_data":{"value":"#b1adad"}},{"label":"Blue","value":"75","swatch_data":{"value":"#3f51b5"}},{"label":"Red","value":"76","swatch_data":{"value":"#f44336"}}]},{"attribute_value":"Cotton","attribute_code":"material","attribute_type":"text","attribute_label":"Material","attribute_options":[]}]}]}}};

export const mapStateToProps = state => ({
    items: ITEMS.data.getOrderById.order_products,
});

export const mapDispatchToProps = dispatch => ({
});

export class MyAccountNewReturnItemSelectContainer extends DataContainer {
    static propTypes = {
        customer: customerType.isRequired
    };

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

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountNewReturnItemSelectContainer);
