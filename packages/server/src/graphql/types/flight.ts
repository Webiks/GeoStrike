import gql from 'graphql-tag';

export const schema = gql`
   type Flight {
    icao24: String
    callsign: String
    origin_country: String
    time_position: String
    last_contact: String
    longitude: String
    latitude: String
    geo_altitude: String
    on_ground: String
    velocity: String
    heading: String
    vertical_rate: String
    sensors: String
    baro_altitude: String
    squawk: String
    spi: String
    position_source: String
}`;
