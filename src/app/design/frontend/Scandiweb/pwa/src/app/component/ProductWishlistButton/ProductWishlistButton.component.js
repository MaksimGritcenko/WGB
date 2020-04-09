/* eslint-disable max-len */
import SourceProductWishlistButton from 'SourceComponent/ProductWishlistButton/ProductWishlistButton.component';
import './ProductWishlistButton.override.style.scss';

export default class ProductWishlistButton extends SourceProductWishlistButton {
    renderHollow() {
        return (
            <svg width="20px" height="25px" viewBox="0 0 20 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
                <g id="Page-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="PDP_mobile_description" transform="translate(-339.000000, -119.000000)" fill="#000000" fillRule="nonzero">
                        <g id="bookmark" transform="translate(339.000000, 119.000000)">
                            <path d="M19.3034945,0 L0.696230516,0 C0.311944761,0 7.5685501e-07,0.276643375 7.5685501e-07,0.61798178 L7.5685501e-07,23.7630893 C-0.00054237827,24.226817 0.291275463,24.6516795 0.755790749,24.8636279 C1.22057798,25.075335 1.7797369,25.0384008 2.2037295,24.7677924 L9.99986255,19.8072817 L17.7962675,24.767551 C18.220532,25.0376767 18.779147,25.0743694 19.2436623,24.8626623 C19.7079057,24.6509552 20.0000008,24.2263342 20.0000008,23.7630893 L20.0000008,0.61798178 C20.0000008,0.276643375 19.6880522,0 19.3034945,0 Z M18.6072655,23.7628479 L10.4059055,18.5445228 C10.1633132,18.3902688 9.83695582,18.3902688 9.59463548,18.5445228 L1.39300348,23.7630893 L1.39300348,1.23596356 L18.6072655,1.23596356 L18.6072655,23.7628479 Z" id="Shape" />
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    renderFilled() {
        return (
            <svg width="40px" height="40px" viewBox="0 0 297 414" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter x="-4.5%" y="-3.2%" width="109.0%" height="106.4%" filterUnits="objectBoundingBox" id="filter-1">
                        <feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
                        <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
                        <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1" result="shadowMatrixOuter1" />
                        <feMerge>
                            <feMergeNode in="shadowMatrixOuter1" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <path d="M277.527344,0 L10.269531,0 C4.75,0 0.269520099,4.476562 0.269520099,10 L0.269520099,384.527344 C0.261719,392.03125 4.453125,398.90625 11.125,402.335938 C17.800781,405.761719 25.832031,405.164062 31.921875,400.785156 L143.898438,320.515625 L255.878906,400.78125 C261.972656,405.152344 269.996094,405.746094 276.667969,402.320312 C283.335938,398.894531 287.53125,392.023438 287.53125,384.527344 L287.53125,10 C287.53125,4.476562 283.050781,0 277.527344,0 Z M267.527344,384.523438 L149.730469,300.082031 C146.246094,297.585938 141.558594,297.585938 138.078125,300.082031 L20.277344,384.527344 L20.277344,20 L267.527344,20 L267.527344,384.523438 Z" id="path-2"/>
                    <filter x="-0.9%" y="-0.6%" width="101.7%" height="101.2%" filterUnits="objectBoundingBox" id="filter-3">
                        <feGaussianBlur stdDeviation="1.5" in="SourceAlpha" result="shadowBlurInner1" />
                        <feOffset dx="0" dy="1" in="shadowBlurInner1" result="shadowOffsetInner1" />
                        <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1" />
                        <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowInnerInner1" />
                    </filter>
                </defs>
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="shipping_desktop" transform="translate(-821.000000, -1125.000000)">
                        <g id="Group" transform="translate(826.000000, 1128.000000)">
                            <g id="bookmark-(1)" filter="url(#filter-1)" fillRule="nonzero">
                                <g id="Shape">
                                    <use fill="#110F0F" xlinkHref="#path-2" />
                                    <use fill="black" fillOpacity="1" filter="url(#filter-3)" xlinkHref="#path-2" />
                                    <use stroke="#080808" strokeWidth="1" xlinkHref="#path-2" />
                                </g>
                            </g>
                            <polygon id="Path-2" fill="#0E0D0D" points="20.277344 20 20.277344 384.527344 143.90038 298.727317 267.527344 384.527344 267.527344 20" />
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    renderButton() {
        const { isInWishlist, isDisabled, mix } = this.props;

        return (
            <button
              block="ProductWishlistButton"
              mods={ { isInWishlist, isDisabled } }
              mix={ {
                  block: 'Button',
                  mix
              } }
              title={ this.getTitle() }
              onClick={ this.onClick }
            >
                { isInWishlist ? this.renderFilled() : this.renderHollow() }
            </button>
        );
    }
}
