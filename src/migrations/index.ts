import * as migration_20260330_115626_init_db from './20260330_115626_init_db';
import * as migration_20260409_074324 from './20260409_074324';
import * as migration_20260409_drop_mailing_sends from './20260409_drop_mailing_sends';
import * as migration_20260410_drop_mailings from './20260410_drop_mailings';
import * as migration_20260410_add_place_premium_features from './20260410_add_place_premium_features';

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
  {
    up: migration_20260410_drop_mailings.up,
    down: migration_20260410_drop_mailings.down,
    name: '20260410_drop_mailings',
  },
  {
    up: migration_20260410_add_place_premium_features.up,
    down: migration_20260410_add_place_premium_features.down,
    name: '20260410_add_place_premium_features',
  },
];
