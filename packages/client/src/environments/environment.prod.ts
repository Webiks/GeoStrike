export const environment = {
  production: true,
  serverUrl: '35.156.14.39:3001',
  // serverUrl: '35.156.14.39:3000'
  wsSchema: 'ws',
  movement: {
    runningSpeed: 1.0,
    walkingSpeed: 0.25,
    crawlingSpeed: 0.1,
    flyingSpeed: 3.0
  },
  createPathMode: false,
  loadTerrain: true,
  load3dTiles: true,
  tiles: {
    urban_url: 'https://beta.cesium.com/api/assets/1461?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWJmM2MzNS02OWM5LTQ3OWItYjEyYS0xZmNlODM5ZDNkMTYiLCJpZCI6NDQsImFzc2V0cyI6WzE0NjFdLCJpYXQiOjE0OTkyNjQ3NDN9.vuR75SqPDKcggvUrG_vpx0Av02jdiAxnnB1fNf-9f7s',
    mountain_url: 'https://beta.cesium.com/api/assets/1461?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWJmM2MzNS02OWM5LTQ3OWItYjEyYS0xZmNlODM5ZDNkMTYiLCJpZCI6NDQsImFzc2V0cyI6WzE0NjFdLCJpYXQiOjE0OTkyNjQ3NDN9.vuR75SqPDKcggvUrG_vpx0Av02jdiAxnnB1fNf-9f7s',
    swiss_url: 'https://vectortiles.geo.admin.ch/ch.swisstopo.swisstlm3d.3d/20161217/tileset.json'
  },
  terrain: {
    // url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
    url: '//3d.geo.admin.ch/1.0.0/ch.swisstopo.terrain.3d/default/20160115/4326/',
    // url : 'https://assets.agi.com/stk-terrain/v1/tilesets/PAMAP/tiles',
    requestWaterMask: true,
    requestVertexNormals: true
  },
  controls: {
    mouseSensitivity: 16, // bigger is less sensitive
    disableBackward: true,
    disableLeft: true,
    disableRight: true,
  }
};
