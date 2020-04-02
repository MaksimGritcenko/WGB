import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './ProductExhibition.style';

export const IMAGE_TYPE = 'image';
export const VIDEO_TYPE = 'external-video';
export const PLACEHOLDER_TYPE = 'placeholder';

class ProductExhibition extends PureComponent {
    static propTypes = {
        children: PropTypes.arrayOf(PropTypes.element).isRequired
    };

    render() {
        const { children } = this.props;

        return (
            <div block="ProductExhibition">
                { children }
            </div>
        );
    }
}

export default ProductExhibition;
