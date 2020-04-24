import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MyAccountNewReturnCustomerTable from 'Component/MyAccountNewReturnCustomerTable';
import MyAccountNewReturnAddressTable from 'Component/MyAccountNewReturnAddressTable';
import MyAccountReturnDetailsItems from 'Component/MyAccountReturnDetailsItems';
import MyAccountReturnDetailsTracking from 'Component/MyAccountReturnDetailsTracking';
import ExpandableContent from 'Component/ExpandableContent';

import './MyAccountReturnDetails.style';

const STATUS_STATE_CANCELED = 'Canceled';
const STATUS_STATE_MAP = {
    Processing: 1,
    Approved: 2,
    Delivered: 3,
    Completed: 4
}

export default class MyAccountReturnDetails extends PureComponent {
    static propTypes = {
        carriers: PropTypes.array.isRequired,
        details: PropTypes.object.isRequired,
        handleCancelRMA: PropTypes.func.isRequired,
        isCancelDisabled: PropTypes.bool.isRequired,
        renderPageTitle: PropTypes.func.isRequired
    };

    state = {
        isHowItWorksBlockExpanded: true
    };

    handleCancelRMA = () => {
        const { handleCancelRMA, isCancelDisabled } = this.props;

        if (isCancelDisabled) return;

        handleCancelRMA();
    };

    toggleExpandableContent = () => {
        const { isHowItWorksBlockExpanded } = this.state;

        this.setState({ isHowItWorksBlockExpanded: !isHowItWorksBlockExpanded });
    };

    renderHowItWorksBlock() {
        const { isHowItWorksBlockExpanded } = this.state;

        return (
            <ExpandableContent
              heading={ __('Returns: how it works') }
              isContentExpanded={ isHowItWorksBlockExpanded }
              onClick={ this.toggleExpandableContent }
              mix={ {
                  block: 'MyAccountReturnDetails',
                  elem: 'HowItWorksBlock'
              } }
            >
                <div
                  block="MyAccountReturnDetails"
                  elem="HowItWorksDescription"
                >
                    { '<Description of step 2.Approved>' }
                </div>
            </ExpandableContent>
        );
    }

    renderProgressItem(name, itemIndex, state) {
        const index = itemIndex + 1;
        const activeIndex = STATUS_STATE_MAP[state];

        const isLastActive = activeIndex === index;
        const mods = { isActive: index <= activeIndex, isLastActive };

        return (
            <div
              block="MyAccountReturnDetails"
              elem="ProgressItem"
              mods={ mods }
              key={ itemIndex }
            >
                <div
                  block="MyAccountReturnDetails"
                  elem="ProgressContent"
                >
                    <span
                      block="MyAccountReturnDetails"
                      elem="ProgressCircle"
                      mods={ mods }
                    >
                        { isLastActive && index }
                    </span>
                    <span
                      block="MyAccountReturnDetails"
                      elem="ProgressName"
                      mods={ { isLastActive } }
                    >
                        { name }
                    </span>
                </div>
            </div>

        );
    }

    renderProgressBar() {
        const { details: { state } } = this.props;

        if (state === STATUS_STATE_CANCELED) return null;

        return (
            <div
              block="MyAccountReturnDetails"
              elem="ProgressBar"
            >
                { [
                    '1. Processing',
                    '2. Approved',
                    '3. Delivered',
                    '4. Completed'
                ].map((item, index) => this.renderProgressItem(item, index, state)) }
            </div>
        );
    }

    renderCalcelRMATitle() {
        return (
            <span
              block="MyAccountReturnDetails"
              elem="CancelRMATitle"
            >
                CANCELED
            </span>
        );
    }

    renderCalcelRMAButton() {
        const { isCancelDisabled, details: { state } } = this.props;

        if (state === STATUS_STATE_CANCELED) return this.renderCalcelRMATitle();

        return (
            <button
              block="Button"
              mods={ { isHollow: true } }
              disabled={ isCancelDisabled }
              mix={ {
                  block: 'MyAccountReturnDetails',
                  elem: 'CancelRMAButton'
              } }
              onClick={ this.handleCancelRMA }
            >
                { __('CANCEL RMA') }
            </button>
        );
    }

    render() {
        const {
            details,
            carriers,
            details: {
                items = [],
                id = ''
            },
            renderPageTitle
        } = this.props;

        return (
            <div block="MyAccountReturnDetails">
                { renderPageTitle(id) }
                { this.renderProgressBar() }
                <div
                  block="MyAccountReturnDetails"
                  elem="CustomerAndAddressBlocks"
                >
                    <MyAccountNewReturnCustomerTable />
                    <MyAccountNewReturnAddressTable />
                </div>
                { this.renderHowItWorksBlock() }
                <MyAccountReturnDetailsItems
                  items={ items }
                />
                <MyAccountReturnDetailsTracking
                  carriers={ carriers }
                  details={ details }
                />
                { this.renderCalcelRMAButton() }
            </div>
        );
    }
}
