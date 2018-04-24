import gql from 'graphql-tag';


export const airTrafficQuery = gql`
  query{
  airTraffic {
    icao24
    longitude
    latitude
    geo_altitude
    velocity
    heading
  }
}
`;
