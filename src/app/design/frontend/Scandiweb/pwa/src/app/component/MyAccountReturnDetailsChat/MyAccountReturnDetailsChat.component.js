import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './MyAccountReturnDetailsChat.style';

class MyAccountReturnDetailsChat extends PureComponent {
    static propTypes = {
        // Refs
        fileFormRef: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.shape({ current: PropTypes.instanceOf(Element) })
        ]).isRequired,
        messageAreaRef: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.shape({ current: PropTypes.instanceOf(Element) })
        ]).isRequired,
        // Other
        onFileAttach: PropTypes.func.isRequired,
        sendMessage: PropTypes.func.isRequired,
        isButtonDisabled: PropTypes.bool
    };

    static defaultProps = {
        isButtonDisabled: false
    };

    render() {
        const {
            onFileAttach,
            fileFormRef,
            sendMessage,
            isButtonDisabled,
            messageAreaRef
        } = this.props;

        return (
            <div block="MyAccountReturnDetailsChat">
                <h3>Message</h3>
                <textarea
                  cols="30"
                  rows="5"
                  placeholder={ __(' Please, describe the issue in details.') }
                  ref={ messageAreaRef }
                />
                <div
                  block="amrma-attach-file"
                >
                    <label
                      htmlFor="amrma-attach"
                      block="amrma-label"
                    >
                        { __('Attach File') }
                    </label>
                    <input
                      type="file"
                      id="amrma-attach"
                      accept=".pdf,.png,.jpg,.jpeg,.gif"
                      multiple
                      block="amrma-attach"
                      onChange={ onFileAttach }
                      ref={ fileFormRef }
                    />
                    <input type="hidden" name="attach-files" id="amrma-attached-files" data-amrma-js="file-input"/>
                </div>
                <button
                  block="Button"
                  onClick={ sendMessage }
                  disabled={ isButtonDisabled }
                >
                    Send
                </button>
            </div>
        );
    }
}

export default MyAccountReturnDetailsChat;
