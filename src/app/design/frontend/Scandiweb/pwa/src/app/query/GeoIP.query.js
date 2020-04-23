import { Field } from 'Util/Query';

export class GeoIPQuery {
    getQuery() {
        return new Field('getUserLocation')
            .addField('country')
            .addField('country_name');
    }
}

export default new GeoIPQuery();
