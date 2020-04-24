import { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import ContentWrapper from 'Component/ContentWrapper';
import ExpandableContent from 'Component/ExpandableContent';

export default class ProducReturnRules extends PureComponent {
    static propTypes = {
        areDetailsLoaded: PropTypes.bool.isRequired,
        isRmaInfoShowed: PropTypes.bool.isRequired,
        returnResolutions: PropTypes.object
    };

    static defaultProps = {
        returnResolutions: {}
    };

    renderReturnRule = ({ value, resolution: { label, resolution_id } }) => (
        <Fragment key={ resolution_id }>
            <dt block="ProductInformation" elem="AttributeLabel">
                { `${ label } period` }
            </dt>
            <dd block="ProductInformation" elem="ValueLabel">
                { value }
            </dd>
        </Fragment>
    );

    renderReturnRules() {
        const { returnResolutions } = this.props;

        return (
            <dl block="ProductInformation" elem="Attributes">
                { returnResolutions.map(this.renderReturnRule) }
            </dl>
        );
    }

    renderContent() {
        return (
            <ExpandableContent
              heading={ __('Product Returns') }
              mix={ { block: 'ProductInformation', elem: 'Content' } }
            >
                { this.renderReturnRules() }
            </ExpandableContent>
        );
    }

    render() {
        const { areDetailsLoaded, returnResolutions, isRmaInfoShowed } = this.props;

        if (!areDetailsLoaded || !isRmaInfoShowed || !returnResolutions.length) return null;

        return (
            <ContentWrapper
              label="Product Returns"
              mix={ { block: 'ProductInformation' } }
              wrapperMix={ { block: 'ProductInformation', elem: 'Wrapper' } }
            >
                { this.renderContent() }
            </ContentWrapper>
        );
    }
}
