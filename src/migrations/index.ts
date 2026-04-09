import * as migration_20260330_115626_init_db from './20260330_115626_init_db';
import * as migration_20260409_074324 from './20260409_074324';
import * as migration_20260409_drop_mailing_sends from './20260409_drop_mailing_sends';

export const migrations = [
  {
    up: migration_20260330_115626_init_db.up,
    down: migration_20260330_115626_init_db.down,
    name: '20260330_115626_init_db',
  },
  {
    up: migration_20260409_074324.up,
    down: migration_20260409_074324.down,
    name: '20260409_074324',
  },
  {
    up: migration_20260409_drop_mailing_sends.up,
    down: migration_20260409_drop_mailing_sends.down,
    name: '20260409_drop_mailing_sends',
  },
];
