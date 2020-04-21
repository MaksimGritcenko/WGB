import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Field from 'Component/Field';

import './MyAccountReturnDetailsTracking.style';

export default class MyAccountReturnDetailsTracking extends PureComponent {
    static propTypes = {
        carriers: PropTypes.array.isRequired,
        details: PropTypes.object.isRequired,
        handleTrackingInformationAdd: PropTypes.object.isRequired
    };

    state = {
        trackingCode: '',
        trackingNumber: '',
        errors: {
            trackingCode: false,
            trackingNumber: false
        }
    };

    handleTrackingInformationAdd = () => {
        const { handleTrackingInformationAdd, details: { id } } = this.props;
        const { trackingCode, trackingNumber } = this.state;

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
            trackingNumber: ''
        }));
    };

    handleSelectChange = (trackingCode) => {
        const { errors } = this.state;

        this.setState({
            trackingCode,
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
                  message={ errors.trackingCode && 'Select field!' }
                  onChange={ this.handleSelectChange }
                />
                <Field
                  type="text"
                  id="trackingcode"
                  name="trackingcode"
                  value={ trackingNumber }
                  message={ errors.trackingNumber && 'This field is required!' }
                  onChange={ this.handleTrackingCodeInput }
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

    renderTrackingInformationTableRow({ carrier, tracking_number }) {
        return (
            <div
              block="MyAccountReturnDetailsTracking"
              elem="TableRow"
            >
                <span>{ carrier }</span>
                <span>{ tracking_number }</span>
            </div>
        );
    }

    renderTrackingInformationTable() {
        const { details: { tracking = [] } } = this.props;

        if (!tracking.length) return <span>No tracking</span>;

        return (
            <div>
                { this.renderTrackingInformationTableHead() }
                { tracking.map(this.renderTrackingInformationTableRow) }
            </div>
        );
    }

    render() {
        const { details: { status } } = this.props;

        // if (status === 1) return null;

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
