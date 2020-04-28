import { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { showNotification } from 'Store/Notification';
import ReturnDispatcher from 'Store/Return'
import MyAccountReturnDetailsChat from './MyAccountReturnDetailsChat.component';

// TODO implement retrieval with RMA config
const MAX_FILE_SIZE = 1000; // KB

export const mapStateToProps = state => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = dispatch => ({
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    sendMessage: messageObject => ReturnDispatcher.sendMessage(messageObject, dispatch)
});

export class MyAccountReturnDetailsChatContainer extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    state = {
        isSendButtonDisabled: true
    };

    onFileAttach() {
        const filesFromForm = this.fileFormRef.current.files;

        filesFromForm.forEach(
            /** @param {File} file */
            (file) => {
                // Handle file size more than max allowed
                if (file.size > MAX_FILE_SIZE) {
                    this.setState(() => ({ isSendButtonDisabled: true }));
                    showNotification('error', __(
                        'File %s has exceeded the maximum file size limit of %s KB',
                        file.name,
                        MAX_FILE_SIZE
                    ));
                }
            }
        );
    }

    sendMessage = () => {
        const { requestId, sendMessage } = this.props;
        const filesFromForm = this.fileFormRef.current.files;
        const messageText = this.messageAreaRef.current.value;

        const messageFiles = filesFromForm.reduce(
            (acc, file) => {
                acc.push({
                    // Key names matter
                    name: file.name.substr(0, file.name.lastIndexOf('.')),
                    encoded_file: btoa(file) // base 64 encoding
                });
            }, []
        );

        this.sendMessage(requestId, messageText, messageFiles);
    }

    constructor(props) {
        super(props);

        this.fileFormRef = createRef();
        this.messageAreaRef = createRef();
    }

    containerFunctions = () => ({
        onFileAttach: this.onFileAttach.bind(this),
        sendMessage: this.sendMessage.bind(this)
    });

    containerProps = () => ({
        fileFormRef: this.fileFormRef,
        messageAreaRef: this.messageAreaRef
    });

    render() {
        return (
            <MyAccountReturnDetailsChat
              { ...this.props }
              { ...this.containerFunctions() }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountReturnDetailsChatContainer);
