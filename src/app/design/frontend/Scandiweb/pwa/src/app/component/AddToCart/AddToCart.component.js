import SourceAddToCart from 'SourceComponent/AddToCart/AddToCart.component';
import { createRef } from 'react';
// TODO: implement AddToCart

export default class AddToCart extends SourceAddToCart {
    constructor(props) {
        super(props);

        this.buttonRef = createRef();
    }

    render() {
        const {
            mix,
            product: { type_id },
            isLoading,
            buttonClick
        } = this.props;

        if (!type_id) this.renderPlaceholder();

        return (
            <button
              ref={ this.buttonRef }
              onClick={ () => buttonClick(this.buttonRef) }
              block="Button AddToCart"
              mix={ mix }
              mods={ { isLoading } }
            >
                <span>{ __('Add to cart') }</span>
                <span>{ __('Adding...') }</span>
            </button>
        );
    }
}
