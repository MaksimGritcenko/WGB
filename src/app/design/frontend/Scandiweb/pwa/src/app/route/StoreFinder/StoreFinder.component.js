/* eslint-disable array-callback-return */
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './StoreFinder.style';
import './StoreFinderSelector.style';
import Html from 'Component/Html';
import Field from 'Component/Field';
import { STORES, STORES_SUB } from 'Component/Header';
import isMobile from 'Util/Mobile';
import Loader from 'Component/Loader';

const IMG_PATH = '/media/store_finder/stores/';

const CITY_LIST = [];

class StoreFinder extends PureComponent {
    static propTypes = {
        StoreInfo: PropTypes.arrayOf(
            PropTypes.shape({
                store_name: PropTypes.string,
                address: PropTypes.string,
                city: PropTypes.string,
                phone_number: PropTypes.string,
                store_hours: PropTypes.string,
                working_days: PropTypes.string,
                image_1: PropTypes.string,
                image_2: PropTypes.string,
                image_3: PropTypes.string
            }).isRequired
        ).isRequired,
        updateBreadcrumbs: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired
    };

    state ={
        currentCityId: -1,
        overlay: false,
        isLoading: true
    };

    componentDidMount() {
        this.updateBreadcrumbs();
        this.updateHeaderMod();
    }

    componentDidUpdate() {
        this.getCityList();
    }

    onChange = (value) => {
        const { setHeaderState } = this.props;

        if (!isMobile.any()) {
            this.setState({
                currentCityId: value
            });

            return;
        }

        this.setState({
            currentCityId: value,
            overlay: true
        });

        setHeaderState({
            name: STORES_SUB,
            onCloseClick: () => this.closeOverlay()
        });
    };

    getCityList() {
        const { StoreInfo } = this.props;
        this.emptyCityList();
        return StoreInfo.map((StoreInfo, index) => {
            if (this.checkUniqueCity(StoreInfo.city)) {
                CITY_LIST.push({
                    id: index + 1, label: StoreInfo.city, value: index + 1
                });
            }

            this.setState({
                isLoading: false
            });
        });
    }

    closeOverlay() {
        this.setState({
            overlay: false,
            currentCityId: -1
        });
    }

    checkUniqueCity(cityLabel) {
        const cityFromList = CITY_LIST.find(city => city.label === cityLabel);
        return cityFromList === undefined;
    }

    emptyCityList() {
        CITY_LIST.length = 0;
    }

    updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const breadcrumbs = [
            {
                url: '/stores',
                name: __('Stores')
            },
            {
                url: '/',
                name: __('Home')
            }
        ];

        updateBreadcrumbs(breadcrumbs);
    }

    updateHeaderMod() {
        const { setHeaderState } = this.props;

        setHeaderState({
            name: STORES
        });
    }

    renderCitySelect() {
        const { currentCityId } = this.state;
        return (
            <Field
              id="CitySelect"
              name="CitySelect"
              type="select"
              placeholder="Romania"
              mix={ { block: 'StoreFinder-Select' } }
              selectOptions={ CITY_LIST }
              value={ currentCityId }
              onChange={ this.onChange }
            />
        );
    }

    renderStore() {
        const { StoreInfo } = this.props;
        const { currentCityId } = this.state;
        // eslint-disable-next-line consistent-return
        return StoreInfo.map((StoreInfo, index) => {
            if (StoreInfo.id === currentCityId) {
                const {
                    address,
                    store_name,
                    store_hours,
                    phone_number,
                    image_1,
                    image_2,
                    image_3
                } = StoreInfo;

                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <div block="StoreFinder" elem="Card" key={ index }>
                        <div block="StoreFinder" elem="Info">
                            <p block="StoreFinder" elem="StoreName">
                                { store_name }
                            </p>
                            <p block="StoreFinder" elem="StoreAddress">
                                { address }
                            </p>
                            <div block="StoreFinder" elem="StoreHours">
                            <p block="StoreFinder" elem="SubParagraph">
                            Working hours:
                            </p>
                            <Html content={ store_hours } />
                            </div>
                            <div block="StoreFinder" elem="StorePhone">
                                <p block="StoreFinder" elem="SubParagraph">
                                Phone number:
                                </p>
                                { phone_number }
                            </div>
                        </div>
                        <div block="StoreFinder" elem="ImageBlockWrapper">
                            <div block="StoreFinder" elem="ImageWrapper">
                                <img
                                  block="StoreFinder"
                                  elem="Image"
                                  src={ IMG_PATH + image_1 }
                                  alt={ image_1 }
                                />
                                <img
                                  block="StoreFinder"
                                  elem="Image"
                                  src={ IMG_PATH + image_2 }
                                  alt={ image_2 }
                                />
                                <img
                                  block="StoreFinder"
                                  elem="Image"
                                  src={ IMG_PATH + image_3 }
                                  alt={ image_3 }
                                />
                            </div>
                        </div>
                    </div>
                );
            }
        });
    }

    renderTitle() {
        const { currentCityId } = this.state;

        // eslint-disable-next-line consistent-return
        return CITY_LIST.map((city, index) => {
            if (city.id === currentCityId) {
                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <div block="StoreFinder" elem="CityTitle" key={ index }>
                        { city.label }
                    </div>
                );
            }
        });
    }

    renderStoreLocator() {
        const { overlay } = this.state;
        if (overlay) {
            return (
                <div block="StoreFinder">
                { this.renderTitle() }
                    { this.renderStore() }
                </div>
            );
        }

        if (isMobile.any()) {
            return (
            <div block="StoreFinder">
                <div block="StoreFinder" elem="Title">
                    { __('STORE LOCATIONS') }
                </div>
                { this.renderCitySelect() }
            </div>
            );
        }

        return (
            <div block="StoreFinder">
                <div block="StoreFinder" elem="Title">
                    { __('STORE LOCATIONS') }
                </div>
                { this.renderCitySelect() }
                { this.renderStore() }
            </div>
        );
    }

    render() {
        const { isLoading } = this.state;
        return (
            <>
                <Loader isLoading={ isLoading } />
                { this.renderStoreLocator() }
            </>
        );
    }
}

export default StoreFinder;
