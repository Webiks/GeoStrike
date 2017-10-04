export const AVAILABLE_CHARACTERS = [
  {
    name: 'Steve Rogers',
    description: 'Blue Team',
    team: 'BLUE',
    imageUrl: '/assets/characters/soldier_temp.png',
  },
  {
    name: 'Anthony Stark',
    description: 'Blue Team',
    team: 'BLUE',
    imageUrl: '/assets/characters/soldier_temp.png',
  },
  {
    name: 'Peter Parker',
    description: 'Red Team',
    team: 'RED',
    imageUrl: '/assets/characters/soldier_temp.png',
  },
  {
    name: 'Bruce Wayne',
    description: 'Red Team',
    team: 'RED',
    imageUrl: '/assets/characters/soldier_temp.png',
  },
];
export const VIEWER = {
  name: 'viewer',
  team: 'NONE',
  description: '',
  imageUrl: '',
};

export const BG_CHARACHTERS_MAP = new Map([
  ['car',
    {
      model: '/assets/models/car.gltf',
      scale: 1
    }],
  ['grandpa',
    {
      model: '/assets/models/grandpa.gltf',
      scale: 0.035
    }]
]);
