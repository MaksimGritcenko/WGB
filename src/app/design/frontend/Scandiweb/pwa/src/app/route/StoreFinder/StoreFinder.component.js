/* eslint-disable array-callback-return */
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './StoreFinder.style';
import './StoreFinderSelector.style';
import Html from 'Component/Html';
import Field from 'Component/Field';
import { STORES, STORES_SUB } from 'Component/Header';
import isMobile from 'Util/Mobile';

const IMG_PATH = '/media/store_finder/stores/';

const CITY_LIST = [{
    id: 'none', label: 'none', value: 'none', counter: 0
}];

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
        current_city: 'Romania',
        overlay: false
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

        this.setState({
            current_city: value
        });
        if (isMobile.any()) {
            this.setState({
                overlay: true
            });

            setHeaderState({
                name: STORES_SUB,
                onCloseClick: () => this.closeOverlay()
            });
        }
    }

    getCityList() {
        const { StoreInfo } = this.props;
        this.emptyCityList();
        return StoreInfo.map((StoreInfo, index) => {
            if (this.cityPushCheck(StoreInfo.city)) {
                CITY_LIST.push({
                    id: index, label: StoreInfo.city, value: StoreInfo.city, disabled: false, counter: +1
                });
            }
        });
    }

    closeOverlay() {
        this.setState({
            overlay: false
        });
    }

    cityPushCheck(cityLabel) {
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
        const { current_city } = this.state;
        return (
            <Field
              id="CitySelect"
              name="CitySelect"
              type="select"
              placeholder={ current_city }
              mix={ { block: 'StoreFinder-Select' } }
              selectOptions={ CITY_LIST }
              value={ CITY_LIST.city }
              onChange={ this.onChange }
            />
        );
    }

    renderStore() {
        const { StoreInfo } = this.props;
        const { current_city } = this.state;
        // eslint-disable-next-line array-callback-return
        // eslint-disable-next-line consistent-return
        return StoreInfo.map((StoreInfo, index) => {
            if (StoreInfo.city === current_city) {
                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <div block="StoreFinder" elem="Card" key={ index }>
                        <div block="StoreFinder" elem="Info">
                            <p block="StoreFinder" elem="StoreName">
                                { StoreInfo.store_name }
                            </p>
                            <p block="StoreFinder" elem="StoreAddress">
                                { StoreInfo.address }
                            </p>
                            <div block="StoreFinder" elem="StoreHours">
                            <p block="StoreFinder" elem="SubParagraph">
                            Working hours:
                            </p>
                            <Html content={ StoreInfo.store_hours } />
                            </div>
                            <div block="StoreFinder" elem="StorePhone">
                                <p block="StoreFinder" elem="SubParagraph">
                                Phone number:
                                </p>
                                { StoreInfo.phone_number }
                            </div>
                        </div>
                        <div block="StoreFinder" elem="ImageBlockWrapper">
                            <div block="StoreFinder" elem="ImageWrapper">
                                <img
                                  block="StoreFinder"
                                  elem="Image"
                                  src={ IMG_PATH + StoreInfo.image_1 }
                                  alt={ StoreInfo.image_1 }
                                />
                                <img
                                  block="StoreFinder"
                                  elem="Image"
                                  src={ IMG_PATH + StoreInfo.image_2 }
                                  alt={ StoreInfo.image_2 }
                                />
                                <img
                                  block="StoreFinder"
                                  elem="Image"
                                  src={ IMG_PATH + StoreInfo.image_3 }
                                  alt={ StoreInfo.image_3 }
                                />
                            </div>
                        </div>
                    </div>
                );
            }
        });
    }

    renderTitle() {
        const { current_city } = this.state;

        // eslint-disable-next-line consistent-return
        return CITY_LIST.map((city, index) => {
            if (city.label === current_city) {
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
        return (
            <>
            { this.renderStoreLocator() }
            </>
        );
    }
}

export default StoreFinder;
