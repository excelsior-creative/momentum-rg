import * as migration_20260126_211624 from './20260126_211624';
import * as migration_20260226_045348 from './20260226_045348';

export const migrations = [
  {
    up: migration_20260126_211624.up,
    down: migration_20260126_211624.down,
    name: '20260126_211624',
  },
  {
    up: migration_20260226_045348.up,
    down: migration_20260226_045348.down,
    name: '20260226_045348'
  },
];
