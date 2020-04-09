import { Field } from 'Util/Query';

export class GeoIPQuery {
    getQuery(ip) {
        return new Field('getLocationByIp')
            .addArgument('ip', 'String!', ip)
            .addField('country');
    }
}

export default new GeoIPQuery();
