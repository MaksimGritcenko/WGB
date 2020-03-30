/* eslint-disable max-len */
import SourceProductWishlistButton from 'SourceComponent/ProductWishlistButton/ProductWishlistButton.component';
import './ProductWishlistButton.override.style.scss';

export default class ProductWishlistButton extends SourceProductWishlistButton {
    renderButton() {
        const { isInWishlist, isDisabled, mix } = this.props;

        return (
            <button
              block="ProductWishlistButton"
              mods={ { isInWishlist, isDisabled } }
              mix={ {
                  block: 'Button',
                  mods: { isHollow: !isInWishlist },
                  mix
              } }
              title={ this.getTitle() }
              onClick={ this.onClick }
            >
                <svg width="20px" height="25px" viewBox="0 0 20 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
                    <g id="Page-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g id="PDP_mobile_description" transform="translate(-339.000000, -119.000000)" fill="#000000" fillRule="nonzero">
                            <g id="bookmark" transform="translate(339.000000, 119.000000)">
                                <path d="M19.3034945,0 L0.696230516,0 C0.311944761,0 7.5685501e-07,0.276643375 7.5685501e-07,0.61798178 L7.5685501e-07,23.7630893 C-0.00054237827,24.226817 0.291275463,24.6516795 0.755790749,24.8636279 C1.22057798,25.075335 1.7797369,25.0384008 2.2037295,24.7677924 L9.99986255,19.8072817 L17.7962675,24.767551 C18.220532,25.0376767 18.779147,25.0743694 19.2436623,24.8626623 C19.7079057,24.6509552 20.0000008,24.2263342 20.0000008,23.7630893 L20.0000008,0.61798178 C20.0000008,0.276643375 19.6880522,0 19.3034945,0 Z M18.6072655,23.7628479 L10.4059055,18.5445228 C10.1633132,18.3902688 9.83695582,18.3902688 9.59463548,18.5445228 L1.39300348,23.7630893 L1.39300348,1.23596356 L18.6072655,1.23596356 L18.6072655,23.7628479 Z" id="Shape" />
                            </g>
                        </g>
                    </g>
                </svg>
            </button>
        );
    }
}
