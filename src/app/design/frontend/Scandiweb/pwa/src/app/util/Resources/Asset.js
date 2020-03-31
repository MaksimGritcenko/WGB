const { publicPath } = window;
const ASSETS_PATH = `${publicPath}assets`;
const MEDIA_PATH = 'media';
const IMAGES_PATH = 'images/global';
const FONT_PATH = 'font';
const FAVICON_PATH = 'favicon';

/**
 * Asset manager to be used to get links to various resources from a centralised location
 * @class Asset
 */
class Asset {
    /**
     * Replace any duplicate slashes with one
     * @param {string} path
     */
    static _sanitize(path = '') {
        return path.replace(/\/+/g, '/');
    }

    /**
     * Paths in /static/frontend/Netnutri/pwa/en_US/Magento_Theme/assets
     * @param {string} path
     * @param {string} subresource
     */
    static url(path = '', subresource = '') {
        const _path = path ? `/${path}` : '';
        if (subresource) {
            return this._sanitize(`/${ASSETS_PATH}/${subresource}${_path}`);
        }

        return this._sanitize(`/${ASSETS_PATH}${_path}`);
    }

    /**
     * Paths in /static/frontend/Netnutri/pwa/en_US/Magento_Theme/assets/images/global
     * @param {string} path
     */
    static image(path = '') {
        return this.url(path, IMAGES_PATH);
    }

    /**
     * Paths in /static/frontend/Netnutri/pwa/en_US/Magento_Theme/assets/font
     * @param {string} path
     */
    static font(path = '') {
        return this.url(path, FONT_PATH);
    }

    /**
     * Paths in /static/frontend/Netnutri/pwa/en_US/Magento_Theme/assets/favicon
     * @param {string} path
     */
    static favicon(path = '') {
        return this.url(path, FAVICON_PATH);
    }

    static media(path = '') {
        return this._sanitize(`/${MEDIA_PATH}/${path}`);
    }

    static extractImagesFromProp(prop = '') {
        return JSON.parse(
            (prop.indexOf('base64:') !== -1 ? atob(prop.replace('base64:', '')) : prop)
        );
    }
}

export default Asset;
