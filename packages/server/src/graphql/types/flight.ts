import gql from 'graphql-tag';

export const schema = gql`
   type Flight {
    icao24: String
    longitude: String
    latitude: String
    geo_altitude: String
    velocity: String
    heading: String
}`;
