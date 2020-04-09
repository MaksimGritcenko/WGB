import { Field } from 'Util/Query';

export class GeoIPQuery {
    getQuery(ip) {
        return new Field('getLocationByIp')
            .addArgument('ip', 'String!', ip)
            .addField('country')
            .addField('country_name');
    }
}

export default new GeoIPQuery();
