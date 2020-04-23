import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Field from 'Component/Field';

import './MyAccountReturnDetailsTracking.style';

export default class MyAccountReturnDetailsTracking extends PureComponent {
    static propTypes = {
        carriers: PropTypes.array.isRequired,
        details: PropTypes.object.isRequired,
        handleTrackingInformationAdd: PropTypes.func.isRequired
    };

    state = {
        trackingCode: '',
        trackingNumber: '',
        carrier: '',
        errors: {
            trackingCode: false,
            trackingNumber: false
        },
        newTrackingInfo: []
    };

    handleTrackingInformationAdd = () => {
        const { handleTrackingInformationAdd, details: { id } } = this.props;
        const {
            trackingCode,
            trackingNumber,
            carrier,
            newTrackingInfo
        } = this.state;

        if (!trackingCode || !trackingNumber) {
            this.setState({
                errors: {
                    trackingCode: !trackingCode,
                    trackingNumber: !trackingNumber
                }
            });

            return;
        }

        handleTrackingInformationAdd({
            request_id: id,
            tracking_code: trackingCode,
            tracking_number: trackingNumber
        }).then(value => value && this.setState({
            trackingCode: '',
            trackingNumber: '',
            carrier: '',
            newTrackingInfo: [
                ...newTrackingInfo,
                { carrier, tracking_number: trackingNumber }
            ]
        }));
    };

    handleSelectChange = (trackingCode) => {
        const { carriers } = this.props;
        const { errors } = this.state;

        const carrier = carriers.find(({ value }) => value === trackingCode).label;

        this.setState({
            trackingCode,
            carrier,
            errors: {
                ...errors,
                trackingCode: false
            }
        });
    };

    handleTrackingCodeInput = (trackingNumber) => {
        const { errors } = this.state;

        this.setState({
            trackingNumber,
            errors: {
                ...errors,
                trackingNumber: false
            }
        });
    };

    renderTrackingInformationAdd() {
        const { carriers } = this.props;
        const { trackingCode, trackingNumber, errors } = this.state;
        const selectTitle = 'carriers';

        const selectErrorMessage = errors.trackingCode ? { message: 'Select field!' } : {};
        const trackingNumberErrorMessage = errors.trackingNumber ? { message: 'This field is required!' } : {};

        return (
            <div
              block="MyAccountReturnDetailsTracking"
              elem="Add"
            >
                <Field
                  id={ selectTitle }
                  name={ selectTitle }
                  type="select"
                  placeholder={ __('Please select') }
                  selectOptions={ carriers }
                  value={ trackingCode }
                  onChange={ this.handleSelectChange }
                  { ...selectErrorMessage }
                />
                <Field
                  type="text"
                  id="trackingcode"
                  name="trackingcode"
                  value={ trackingNumber }
                  onChange={ this.handleTrackingCodeInput }
                  { ...trackingNumberErrorMessage }
                />
                <button
                  block="Button"
                  onClick={ this.handleTrackingInformationAdd }
                >
                    { __('ADD') }
                </button>
            </div>
        );
    }

    renderTrackingInformationTableHead() {
        return (
            <div
              block="MyAccountReturnDetailsTracking"
              elem="TableRow"
              mods={ { isHead: true } }
            >
                <span>Carrier</span>
                <span>Tracking number</span>
            </div>
        );
    }

    renderTrackingInformationTableRow({ carrier, tracking_number }, index) {
        return (
            <div
              block="MyAccountReturnDetailsTracking"
              elem="TableRow"
              key={ index }
            >
                <span>{ carrier }</span>
                <span>{ tracking_number }</span>
            </div>
        );
    }

    renderTrackingInformationTable() {
        const { details: { tracking = [] } } = this.props;
        const { newTrackingInfo } = this.state;

        if (!tracking.length && !newTrackingInfo.length) return <span>No tracking</span>;

        return (
            <div>
                { this.renderTrackingInformationTableHead() }
                { tracking.map(this.renderTrackingInformationTableRow) }
                { newTrackingInfo.map(this.renderTrackingInformationTableRow) }
            </div>
        );
    }

    render() {
        const { details: { state } } = this.props;

        if (state !== 'Approved') return null;

        return (
            <>
                <h4
                  block="MyAccountReturnDetailsTracking"
                  elem="Title"
                >
                    Tracking Information
                </h4>
                { this.renderTrackingInformationTable() }
                { this.renderTrackingInformationAdd() }
            </>
        );
    }
}
