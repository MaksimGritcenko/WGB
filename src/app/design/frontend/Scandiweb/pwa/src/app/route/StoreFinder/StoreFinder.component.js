/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

// Leaflet icons not working with webpack
// Solution from https://github.com/Leaflet/Leaflet/issues/4968
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

/* eslint-disable global-require, import/first */
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
// [END] fix

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Map,
    TileLayer,
    Marker,
    Popup
} from 'react-leaflet';
import { BlockListType } from 'Type/CMS';
import ContentWrapper from 'Component/ContentWrapper';
import Meta from 'Component/Meta';
import Field from 'Component/Field/Field.component';
import Html from 'Component/Html';
import { Asset } from 'Util/Resources';
import 'leaflet/dist/leaflet.css';
import './StoreFinder.style';

class StoreFinder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedCity: 'All cities',
            selectedStore: {}
        };

        this.options = {
            identifiers: [
                'quick-links'
            ],
            fields: ['identifier'], // additional fields to query
            sliderId: 1
        };

        this.changeCity = this.changeCity.bind(this);
        this.changeStore = this.changeStore.bind(this);
        this.handleStoreChange = this.handleStoreChange.bind(this);
        this.prepareStorePosition = this.prepareStorePosition.bind(this);
    }

    componentWillMount() {
        const { requestStores } = this.props;

        requestStores();
    }

    componentDidMount() {
        const { enableBreadcrumbs } = this.props;

        this.requestBlocks();
        enableBreadcrumbs();
    }

    componentDidUpdate(prevProps) {
        const { requestStores, location } = this.props;

        if (location.pathname !== prevProps.location.pathname) {
            requestStores();
        }
    }

    getBlockContent(id) {
        const { blocks: { items } } = this.props;

        return (items && items[id]) ? items[id].content : '';
    }

    requestBlocks() {
        const { requestBlocks } = this.props;

        requestBlocks(this.options);
    }

    changeCity(selectedCity) {
        this.setState({ selectedCity, selectedStore: {} });
    }

    changeStore(selectedStore) {
        this.setState({ selectedStore });
    }

    handleStoreChange(store_name) {
        const { storeByName } = this.props;

        this.changeStore(storeByName[store_name] || {});
    }

    prepareMapBounds(allStores) {
        const latLongArr = allStores.map(this.prepareStorePosition);

        return L.latLngBounds(latLongArr);
    }

    prepareStorePosition({ latitude, longitude }) {
        if (!latitude || !longitude) return null;

        return [latitude, longitude];
    }

    prepareStoreData() {
        const { storeListMapped } = this.props;
        const { selectedCity } = this.state;

        const cityStores = storeListMapped[selectedCity]
            || Object.values(storeListMapped).reduce((stores, cityStores) => {
                // eslint-disable-next-line no-param-reassign
                stores = [...stores, ...cityStores];
                return stores;
            }, []);

        return cityStores.reduce((validStores, allStore) => {
            const {
                latitude,
                longitude,
                city,
                store_name
            } = allStore;

            if (latitude > 0 && longitude > 0 && city) {
                const sortInsertIndex = validStores.findIndex(({
                    city: validCity, store_name: validStoreName
                }) => {
                    if (city === validCity) return validStoreName > store_name;

                    return validCity > city;
                });

                const insertPossition = sortInsertIndex >= 0 ? sortInsertIndex : validStores.length;

                validStores.splice(insertPossition, 0, {
                    ...allStore,
                    active: false
                });
            }

            return validStores;
        }, []);
    }

    prepareCityOptions() {
        const { storeListCities: cities } = this.props;

        const validCityOptions = cities.reduce((options, city) => {
            if (city) {
                const sortInsertIndex = options.findIndex(({ label }) => label > city);
                const insertPossition = sortInsertIndex >= 0 ? sortInsertIndex : options.length;

                options.splice(insertPossition, 0, {
                    id: city.replace(/\s/g, ''), label: city
                });
            }

            return options;
        }, []);

        validCityOptions.unshift({ id: __('All cities'), label: __('All cities') });

        return validCityOptions;
    }

    prepareStoreOptions() {
        const allStore = this.prepareStoreData() || [];

        return [{ store_name: __('All stores') }, ...allStore].map(({ store_name }) => (
            { id: store_name, label: store_name }
        )) || [];
    }

    prepareMapData() {
        const { selectedStore, selectedStore: { store_name } } = this.state;
        const allStores = this.prepareStoreData();
        const hasMultipleStores = allStores.length > 1;

        return {
            allStores,
            centerPosition: this.prepareStorePosition(hasMultipleStores ? selectedStore : allStores[0]),
            bounds: hasMultipleStores && !store_name ? this.prepareMapBounds(allStores) : null
        };
    }

    prepareWorkingDays(store) {
        const { working_days } = store;

        if (!working_days) return __('No info about working days');

        const workingDaysMap = working_days.split(',').map(day => day === '1');

        return (
            workingDaysMap.map(isActive => (
                <span
                  block="StoreFinder"
                  elem="Circles"
                  mods={ { isActive } }
                />
            ))
        );
    }

    renderQuickLinks() {
        const content = this.getBlockContent('quick-links');

        return (
            <ContentWrapper
              mix={ { block: 'HomePage', elem: 'QuickLinks' } }
              wrapperMix={ { block: 'HomePage', elem: 'QuickLinksWrapper' } }
              label="Quick Links"
            >
                <Html content={ content } />
            </ContentWrapper>
        );
    }

    renderHeading() {
        return (
            <div block="StoreFinder" elem="Heading">
                <h1 block="StoreFinder" elem="Heading" mods={ { Title: true } }>
                    { __('Shop search') }
                </h1>
            </div>
        );
    }

    renderSelectList() {
        const { selectedCity, selectedStore: { store_name } } = this.state;

        return (
            <div block="StoreFinder" elem="SelectList">
                { this.renderHeading() }
                <div block="StoreFinder" elem="Select">
                    <Field
                      id="city-select"
                      type="select"
                      mix={ { block: 'StoreLocation', elem: 'Search' } }
                      mods={ { select: true } }
                      options={ this.prepareCityOptions() }
                      formRef={ () => null }
                      value={ selectedCity }
                      onChange={ value => this.changeCity(value) }
                    />
                </div>
                <div block="StoreFinder" elem="Select">
                    <Field
                      id="store-select"
                      type="select"
                      mix={ { block: 'StoreLocation', elem: 'Search' } }
                      mods={ { select: true } }
                      options={ this.prepareStoreOptions() }
                      formRef={ () => null }
                      value={ store_name }
                      onChange={ this.handleStoreChange }
                    />
                </div>
            </div>
        );
    }

    renderStoreCardContent(store) {
        const {
            store_name, address, phone_number, store_hours
        } = store;

        return (
            <>
                <h3 block="StoreFinder" elem="StoreInfo" mods={ { type: 'name' } }>
                    { store_name || __('No store name') }
                </h3>
                <span block="StoreFinder" elem="StoreInfo" mods={ { type: 'address' } }>
                    { address || __('No address') }
                </span>
                <span block="StoreFinder" elem="StoreInfo" mods={ { type: 'number' } }>
                    { phone_number || __('No phone number') }
                </span>
                <div block="StoreFinder" elem="StoreInfo" mods={ { type: 'workingdays' } }>
                    { this.prepareWorkingDays(store) }
                </div>
                <span block="StoreFinder" elem="StoreInfo" mods={ { type: 'hours' } }>
                    { store_hours ? <Html content={ store_hours } /> : __('No store hours') }
                </span>
            </>
        );
    }

    renderMarker(store, icon) {
        const { latitude, longitude, store_name } = store;

        return (
            <Marker
              position={ [latitude, longitude] }
              icon={ icon }
              key={ store_name.replace(/\s/g, '') || 'All Stores' }
              riseOnHover
              onClick={ () => this.changeStore(store) }
            >
                <Popup closeButton={ false }>
                    <div block="StoreFinder" elem="Store">
                        { this.renderStoreCardContent(store) }
                    </div>
                </Popup>
            </Marker>
        );
    }

    renderAllMarkers() {
        const { allStores } = this.prepareMapData();

        const icon = new L.Icon({
            iconUrl: Asset.image('marker-icon.svg'),
            iconRetinaUrl: Asset.image('marker-icon.svg'),
            className: 'leaflet-div-icon',
            iconSize: new L.Point(50, 50)
        });

        return allStores.map(store => this.renderMarker(store, icon));
    }

    renderMap() {
        const { centerPosition, bounds } = this.prepareMapData();

        return (
            <div block="StoreFinder" elem="Map">
                <Map
                  center={ centerPosition }
                  zoom={ 13 }
                  bounds={ bounds }
                  boundsOptions={ { padding: [20, 20] } }
                  duration={ 0.8 }
                  animate
                  useFlyTo
                >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      updateWhenIdle={ false }
                      reuseTiles
                    />
                    { this.renderAllMarkers() }
                </Map>
            </div>
        );
    }

    renderStoreCard(store) {
        const { selectedStore: { store_name: selectedStoreName } } = this.state;
        const { store_name } = store;

        return (
            <div
              block="StoreFinder"
              elem="Store"
              key={ store_name.replace(/\s/g, '') }
              mods={ { isActive: store_name === selectedStoreName } }
            >
                { this.renderStoreCardContent(store) }
                <button
                  block="Button"
                  mods={ { likeLink: true } }
                  onClick={ () => this.changeStore(store) }
                >
                    { __('Show on the map') }
                </button>
            </div>
        );
    }

    renderStoreCards() {
        const allStores = this.prepareStoreData();

        return (
            <div block="StoreFinder" elem="StoreCards">
                { allStores.map(store => this.renderStoreCard(store)) }
            </div>
        );
    }

    renderMainContent() {
        const { storeListCities } = this.props;

        if (!storeListCities.length) return null;

        return (
            <div block="StoreFinder" elem="MainContent">
                { this.renderSelectList() }
                { this.renderMap() }
                { this.renderStoreCards() }
            </div>
        );
    }

    render() {
        const metaObject = {
            name: __('Our Shops'),
            title: __('Our Shops'),
            meta_title: __('Our Shops'),
            meta_description: __('Our Shops - Find the closest store'),
            meta_keyword: 'stores'
        };

        return (
            <main block="StoreFinder">
                <ContentWrapper
                  wrapperMix={ { block: 'StoreFinder', elem: 'Wrapper' } }
                  label={ __('Our Shops') }
                >
                    <Meta metaObject={ metaObject } />
                    { this.renderMainContent() }
                </ContentWrapper>
                { this.renderQuickLinks() }
            </main>
        );
    }
}

StoreFinder.propTypes = {
    location: PropTypes.shape().isRequired,
    enableBreadcrumbs: PropTypes.func.isRequired,
    requestStores: PropTypes.func.isRequired,
    storeListCities: PropTypes.arrayOf(PropTypes.string).isRequired,
    storeListMapped: PropTypes.objectOf(
        PropTypes.arrayOf(
            PropTypes.shape({
                latitude: PropTypes.string,
                longitude: PropTypes.string,
                city: PropTypes.string,
                address: PropTypes.string
            })
        )
    ).isRequired,
    storeByName: PropTypes.objectOf(
        PropTypes.shape({
            latitude: PropTypes.string,
            longitude: PropTypes.string,
            city: PropTypes.string,
            address: PropTypes.string
        })
    ).isRequired,
    requestBlocks: PropTypes.func.isRequired,
    blocks: BlockListType.isRequired
};

export default StoreFinder;
