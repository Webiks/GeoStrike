# webicks-cesium-fps

 3D game for real world data. Boom!
 
 ## Getting started
 * Go to project directory
 * install
 ```bash
  yarn
 ```
 * run server & client:
 ```bash
  yarn start
 ```
 * enjoy: https://localhost:4200
 
 ## enable remote users
 * change `apollo.service.ts` connction url to your ip
 ```typescript
    this._subscriptionClient = new SubscriptionClient('ws://localhost:3000/subscriptions' , // OLD
     this._subscriptionClient = new SubscriptionClient('ws://[your_ip]:3000/subscriptions' // NEW
 ```
 * run server
 ```bash
 yarn server
 ```
 * run client
 ```bash
 cd packages/client
 ng serve --disableHostCheck --host 0.0.0.0
 ```
 * Now you and other players on the same lan can connect to http://[your_ip]:4200
