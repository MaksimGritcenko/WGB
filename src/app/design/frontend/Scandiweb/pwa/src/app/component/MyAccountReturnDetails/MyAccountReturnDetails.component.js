import { PureComponent } from 'react';
import MyAccountNewReturnCustomerTable from 'Component/MyAccountNewReturnCustomerTable';
import MyAccountNewReturnAddressTable from 'Component/MyAccountNewReturnAddressTable';
import MyAccountReturnDetailsItems from 'Component/MyAccountReturnDetailsItems';
import ExpandableContent from 'Component/ExpandableContent';
import Field from 'Component/Field';

import './MyAccountReturnDetails.style';

const ACTIVE_STATUS_INDEX = 2;

export default class MyAccountReturnDetails extends PureComponent {
    static propTypes = {
    };

    state = {
        isHowItWorksBlockExpanded: true
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

    renderTrackingInformationTableHead() {
        return (
            <div
              block="MyAccountReturnDetails"
              elem="TrackingInformationTableRow"
              mods={ { isHead: true } }
            >
                <span>Carrier</span>
                <span>Tracking number</span>
            </div>
        );
    }

    renderTrackingInformationTableRow(carrier, trackingNumber) {
        return (
            <div
              block="MyAccountReturnDetails"
              elem="TrackingInformationTableRow"
            >
                <span>{ carrier }</span>
                <span>{ trackingNumber }</span>
            </div>
        );
    }

    renderTrackingInformationTable() {
        return (
            <div>
                { this.renderTrackingInformationTableHead() }
                { [[1,1],[2,2],[3,3]].map(this.renderTrackingInformationTableRow) }
            </div>
        );
    }

    renderTrackingInformationAdd() {
        const selectTitle = 'carriers';

        return (
            <div
              block="MyAccountReturnDetails"
              elem="TrackingInformationAdd"
            >
                <Field
                  id={ selectTitle }
                  name={ selectTitle }
                  type="select"
                  placeholder={ __('Please select') }
                  selectOptions={ [
                      { label: '1', value: '1' },
                      { label: '2', value: '2' },
                      { label: '3', value: '3' }
                  ] }
                  value={ '' }
                //   onChange={ onChange }
                />
                <Field
                  type="text"
                  id="trackingnumber"
                  name="trackingnumber"
                  value={ '' }
                //   onChange={ handleNicknameChange }
                />
                <button
                  block="Button"
                //   onClick={  }
                >
                    { __('ADD') }
                </button>
            </div>
        );
    }

    renderTrackingInformation() {
        if (ACTIVE_STATUS_INDEX === 1) return null;

        return (
            <div>
                <h4
                  block="MyAccountReturnDetails"
                  elem="TrackingInformationTitle"
                >
                    Tracking Information
                </h4>
                { this.renderTrackingInformationTable() }
                { this.renderTrackingInformationAdd() }
            </div>
        );
    }

    renderProgressItem(name, itemIndex, activeIndex) {
        const index = itemIndex + 1;
        const isLastActive = activeIndex === index;
        const mods = { isActive: index <= activeIndex, isLastActive };

        return (
            <div
              block="MyAccountReturnDetails"
              elem="ProgressItem"
              mods={ mods }
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
                    >
                        { name }
                    </span>
                </div>
            </div>

        );
    }

    renderProgressBar() {
        const activeIndex = ACTIVE_STATUS_INDEX;

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
                ].map((item, index) => this.renderProgressItem(item, index, activeIndex)) }
            </div>
        );
    }

    renderCalcelRMAButton() {
        return (
            <button
              block="Button"
              mods={ { isHollow: true } }
              mix={ {
                  block: 'MyAccountReturnDetails',
                  elem: 'CancelRMAButton'
              } }
            //   onClick={  }
            >
                { __('CANCEL RMA') }
            </button>
        );
    }

    render() {
        return (
            <div block="MyAccountReturnDetails">
                { this.renderProgressBar() }
                <div
                  block="MyAccountReturnDetails"
                  elem="CustomerAndAddressBlocks"
                >
                    <MyAccountNewReturnCustomerTable />
                    <MyAccountNewReturnAddressTable />
                </div>
                { this.renderHowItWorksBlock() }
                <MyAccountReturnDetailsItems />
                { this.renderTrackingInformation() }
                { this.renderCalcelRMAButton() }
            </div>
        );
    }
}
