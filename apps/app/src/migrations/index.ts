import * as migration_20260126_211624 from './20260126_211624';
import * as migration_20260226_045348 from './20260226_045348';
import * as migration_20260306_150507 from './20260306_150507';
import * as migration_20260401_135956 from './20260401_135956';

export const migrations = [
  {
    up: migration_20260126_211624.up,
    down: migration_20260126_211624.down,
    name: '20260126_211624',
  },
  {
    up: migration_20260226_045348.up,
    down: migration_20260226_045348.down,
    name: '20260226_045348',
  },
  {
    up: migration_20260306_150507.up,
    down: migration_20260306_150507.down,
    name: '20260306_150507',
  },
  {
    up: migration_20260401_135956.up,
    down: migration_20260401_135956.down,
    name: '20260401_135956'
  },
];
