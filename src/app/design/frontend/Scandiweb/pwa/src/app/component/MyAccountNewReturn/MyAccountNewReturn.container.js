import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createRef } from 'react';
import { ProductReturnQuery, OrderQuery } from 'Query';
import { OrderDispatcher } from 'Store/Order';
import { showNotification } from 'Store/Notification';
import { customerType } from 'Type/Account';
import { fetchMutation, fetchQuery } from 'Util/Request';
import DataContainer from 'Util/Request/DataContainer';
import MyAccountNewReturn from './MyAccountNewReturn.component';
import { encodeFormFiles } from 'Component/MyAccountReturnDetailsChat/MyAccountReturnDetailsChat.container';

export const RETURN_REASONS = 'returnReasons';
export const RETURN_RESOLUTIONS = 'returnResolutions';
export const ITEM_CONDITIONS = 'itemConditions';

export const mapStateToProps = state => ({
    customer: state.MyAccountReducer.customer
});

export const mapDispatchToProps = dispatch => ({
    getOrderList: () => OrderDispatcher.requestOrders(dispatch),
    showNotification: (type, title, error) => dispatch(showNotification(type, title, error)),
    showSuccessNotification: message => dispatch(showNotification('success', message))
});

export class MyAccountNewReturnContainer extends DataContainer {
    static propTypes = {
        customer: customerType.isRequired,
        showNotification: PropTypes.func.isRequired,
        showSuccessNotification: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        reasonData: {},
        isLoading: false,
        orderId: '',
        items: [],
        customFields: {},
        contactData: {},
        createdAt: '',
        shippingCover: {},
        policy: {},
        files: []
    };

    containerFunctions = {
        getShippingAddress: this.getShippingAddress.bind(this),
        onNewRequestSubmit: this.onNewRequestSubmit.bind(this),
        onFileAttach: this.onFileAttach.bind(this),
        handleRemoveFile: this.handleRemoveFile.bind(this)
    };

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

    componentDidMount() {
        this.requestData();
        this.requestPolicy();
    }

    onError = (e) => {
        const { showNotification } = this.props;

        this.setState({ isLoading: false }, () => {
            showNotification('error', 'Error mutation New Return!', e);
        });
    };

    async onNewRequestSubmit(options) {
        const { showSuccessNotification, history } = this.props;
        const { files } = this.state;

        options.message.encoded_files = await encodeFormFiles(files);

        const mutation = ProductReturnQuery.getNewReturnMutation(options);

        this.setState({ isLoading: true });

        fetchMutation(mutation).then(
            ({ createReturnRequest: { return_id } }) => {
                this.setState({ isLoading: false }, () => {
                    showSuccessNotification(__(`Return successfully made, order ID: ${ return_id }`));
                });

                history.goBack();
            },
            this.onError
        );
    }

    getShippingAddress() {
        const { customer: { addresses = [] } } = this.props;
        const key = 'default_shipping';

        return addresses.find(({ [key]: defaultAddress }) => defaultAddress);
    }

    requestPolicy() {
        return this.fetchData(
            [ProductReturnQuery.getRmaPolicy()],
            ({ getRmaPolicy }) => this.setState({ policy: getRmaPolicy }),
            e => showNotification('error', 'Error fetching Policy Data!', e)
        );
    }

    requestData() {
        const { showNotification, history: { location: { pathname } } } = this.props;

        const orderId = pathname
            .split('/')[3]
            .split('&')[1]
            .split('=')[1];

        return fetchQuery([
            ProductReturnQuery.getRmaConfiguration(),
            OrderQuery.getOrderByIdQuery(orderId)
        ]).then(
            ({
                getRmaConfiguration: {
                    reasons,
                    resolutions,
                    conditions,
                    custom_fields: customFields,
                    contact_data: contactData,
                    max_file_size
                }, getOrderById: {
                    order_products: items,
                    base_order_info: { created_at: createdAt }
                }
            }) => {
                const reasonBlock = { reasons, resolutions, conditions };

                const reasonData = Object.entries(reasonBlock).reduce((acc, [key, values]) => ({
                    ...acc,
                    [key.substring(0, key.length - 1)]: values.map(({ [`${ key.substring(0, key.length - 1) }_id`]: id, title }) => (
                        {
                            label: title,
                            value: id
                        }
                    ))
                }), {});

                const shippingCover = reasons.reduce((acc, { reason_id, payer }) => ({
                    ...acc, [reason_id]: payer
                }), {});

                this.setState({
                    reasonData,
                    items,
                    orderId,
                    customFields,
                    contactData,
                    createdAt,
                    shippingCover,
                    max_file_size
                });
            },
            e => showNotification('error', 'Error fetching New Return!', e)
        );
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

    constructor(props) {
        super(props);

        this.fileFormRef = createRef();
    }

    render() {
        const {
            reasonData,
            items,
            orderId,
            isLoading,
            customFields,
            contactData,
            createdAt,
            shippingCover
        } = this.state;

        return (
            <MyAccountNewReturn
              { ...this.props }
              { ...this.state }
              { ...this.containerFunctions }
              fileFormRef={ this.fileFormRef }
              reasonData={ reasonData }
              items={ items }
              orderId={ orderId }
              isLoading={ isLoading }
              customFields={ customFields }
              contactData={ contactData }
              createdAt={ createdAt }
              shippingCover={ shippingCover }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountNewReturnContainer);
