import * as migration_20260126_211624 from './20260126_211624';

export const migrations = [
  {
    up: migration_20260126_211624.up,
    down: migration_20260126_211624.down,
    name: '20260126_211624'
  },
];
