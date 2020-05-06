import { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { history } from 'Route';

import { showNotification } from 'Store/Notification';
import { ReturnDispatcher } from 'Store/Return'
import { ProductReturnQuery } from 'Query';
import { fetchMutation } from 'Util/Request';
import MyAccountReturnDetailsChat from './MyAccountReturnDetailsChat.component';

export const mapStateToProps = state => ({  });

export const mapDispatchToProps = dispatch => ({
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    sendMessage: (requestId, messageText, messageFiles) => ReturnDispatcher.sendMessage(requestId, messageText, messageFiles, dispatch),
    updateMessageList: () => ReturnDispatcher.updateMessageList(requestId, dispatch)
});

export const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
});

export const encodeFormFiles = async (filesFromForm) => {
    return Object.values(filesFromForm).reduce(
        async (previousPromise, file) => {
            const acc = await previousPromise;
            acc.push({
                name: file.name,
                encoded_file: await fileToBase64(file)
            });

            return acc;
        }, Promise.resolve([])
    )
}

export class MyAccountReturnDetailsChatContainer extends PureComponent {
    static propTypes = {
        showNotification: PropTypes.func.isRequired,
        sendMessage: PropTypes.func.isRequired
    };

    state = {
        isSendDisabled: true,
        isChatLoading: false,
        chatMessages: [],
        files: []
    };

    componentDidMount() {
        this.requestChat();
    }

    requestChat() {
        const { location: { pathname } } = history;

        this.setState({ isChatLoading: true });

        const returnId = pathname
            .split('/')[3]
            .split('&')[1]
            .split('=')[1];

        const mutation = ProductReturnQuery.getRmaChat(`${ returnId }`);

        return fetchMutation(mutation).then(
            ({ getRmaChatForRequest: { messages } }) => {
                this.setState({
                    isChatLoading: false,
                    chatMessages: messages
                });
            },
            this.onError
        );
    }

    onFileAttach() {
        const filesFromForm = this.fileFormRef.current.files || [];
        const { max_file_size, showNotification } = this.props;
        const oldFiles = [].concat(this.state.files);

        const newFiles = Object.values(filesFromForm).reduce(
            /** @param {File} file */
            (acc, file) => {
                // Handle file size more than max allowed
                // But first transform from b to Kb
                if (file.size / 1024 > max_file_size) {
                    showNotification('error', __(
                        'File %s has exceeded the maximum file size limit of %s KB',
                        file.name,
                        max_file_size
                    ));

                    return acc;
                }

                acc.push(file);
                return acc;
            }, oldFiles
        );

        this.setState({
            files: newFiles,
            isSendDisabled: !newFiles.length
        })
    }

    handleTextAreaChange = ({ target: { value } }) => {
        const { isSendDisabled } = this.state;

        if (value && isSendDisabled) this.setState({ isSendDisabled: false });
        if (!value && !isSendDisabled) this.setState({ isSendDisabled: true });
    }

    handleRemoveFile(name) {
        const { files } = this.state;

        const newFiles = files.reduce(
            (acc, file) => {
                if (file.name !== name) {
                    acc.push(file);
                }

                return acc;
            }, []
        )

        this.setState(() => ({
            files: newFiles
        }));
    }

    onMessageSuccess = () => {
        this.messageAreaRef.current.value = "";
        this.setState(() => ({
            isSendDisabled: true,
            files: []
        }));
        this.requestChat();
    }

    handleSendMessageClick = async () => {
        const { requestId, sendMessage } = this.props;
        const { files } = this.state;
        const messageText = this.messageAreaRef.current.value;

        this.setState(() => ({ isChatLoading: true }));
        const messageFiles = await encodeFormFiles(files);

        try {
            await sendMessage(requestId, messageText, messageFiles);
        } catch (e) {
            showNotification('error', 'Error sending message!', e);
            return;
        }

        this.onMessageSuccess();
    }

    constructor(props) {
        super(props);

        this.fileFormRef = createRef();
        this.messageAreaRef = createRef();
    }

    containerFunctions = () => ({
        handleTextAreaChange: this.handleTextAreaChange.bind(this),
        handleSendMessageClick: this.handleSendMessageClick.bind(this),
        handleAttachFile: this.onFileAttach.bind(this),
        handleRemoveFile: this.handleRemoveFile.bind(this)
    });

    containerProps = () => ({
        fileFormRef: this.fileFormRef,
        messageAreaRef: this.messageAreaRef
    });

    render() {
        const { chatMessages, isChatLoading } = this.state;

        return (
            <MyAccountReturnDetailsChat
              { ...this.state }
              { ...this.props }
              { ...this.containerFunctions() }
              { ...this.containerProps() }
              chatMessages={ chatMessages }
              isChatLoading={ isChatLoading }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountReturnDetailsChatContainer);
