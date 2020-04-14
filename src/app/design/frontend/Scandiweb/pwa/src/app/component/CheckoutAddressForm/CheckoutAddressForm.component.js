import SourceCheckoutAddressForm from 'SourceComponent/CheckoutAddressForm/CheckoutAddressForm.component';

class CheckoutAddressForm extends SourceCheckoutAddressForm {
    getDefaultValues([key, props]) {
        const {
            type = 'text',
            onChange = () => {},
            label,
            ...otherProps
        } = props;

        return {
            ...otherProps,
            placeholder: label,
            key,
            name: key,
            id: key,
            type,
            onChange
        };
    }
}

export default CheckoutAddressForm;
