import gql from 'graphql-tag';


export const flightSubscription = gql`
  subscription{
  messageAdded{
    icao24
    latitude
    longitude
    geo_altitude
    velocity
    heading
    time
  }
} 
`;
