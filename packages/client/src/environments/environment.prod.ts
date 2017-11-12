export const environment = {
  production: true,
  serverUrl: 'cesium-fps-server.now.sh',
  wsSchema: 'wss',
  movement: {
    runningSpeed: 1.0,
    walkingSpeed: 0.25,
    crawlingSpeed: 0.1,
  },
  createPathMode: false,
  loadTerrain: false,
  load3dTiles: true,
  tiles: {
    url: 'https://beta.cesium.com/api/assets/1461?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWJmM2MzNS02OWM5LTQ3OWItYjEyYS0xZmNlODM5ZDNkMTYiLCJpZCI6NDQsImFzc2V0cyI6WzE0NjFdLCJpYXQiOjE0OTkyNjQ3NDN9.vuR75SqPDKcggvUrG_vpx0Av02jdiAxnnB1fNf-9f7s',
  },
  terrain: {
    url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
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
