import * as migration_20251226_141510_initial_migration from './20251226_141510_initial_migration';
import * as migration_20251226_142603_fix_passion_cards_theme from './20251226_142603_fix_passion_cards_theme';
import * as migration_20251226_160658_add_content_generation_settings from './20251226_160658_add_content_generation_settings';
import * as migration_20251226_170438_add_rocket_icon_to_services from './20251226_170438_add_rocket_icon_to_services';
import * as migration_20251226_190040_add_generation_costs from './20251226_190040_add_generation_costs';
import * as migration_20251226_193215_cleanup_unused_tables from './20251226_193215_cleanup_unused_tables';
import * as migration_20251231_152050_fix_generation_costs_and_add_checkpoints from './20251231_152050_fix_generation_costs_and_add_checkpoints';
import * as migration_20260102_232503_add_industry_landing_pages from './20260102_232503_add_industry_landing_pages';
import * as migration_20260102_232556_add_industry_checkpoints from './20260102_232556_add_industry_checkpoints';
import * as migration_20260102_233056_add_infographic_to_industries from './20260102_233056_add_infographic_to_industries';
import * as migration_20260104_205845_add_search_collection from './20260104_205845_add_search_collection';
import * as migration_20260104_210423_add_excerpt_to_search from './20260104_210423_add_excerpt_to_search';
import * as migration_20260107_175950_add_article_tags from './20260107_175950_add_article_tags';
import * as migration_20260107_233745_add_article_id_to_checkpoints from './20260107_233745_add_article_id_to_checkpoints';

export const migrations = [
  {
    up: migration_20251226_141510_initial_migration.up,
    down: migration_20251226_141510_initial_migration.down,
    name: '20251226_141510_initial_migration',
  },
  {
    up: migration_20251226_142603_fix_passion_cards_theme.up,
    down: migration_20251226_142603_fix_passion_cards_theme.down,
    name: '20251226_142603_fix_passion_cards_theme',
  },
  {
    up: migration_20251226_160658_add_content_generation_settings.up,
    down: migration_20251226_160658_add_content_generation_settings.down,
    name: '20251226_160658_add_content_generation_settings',
  },
  {
    up: migration_20251226_170438_add_rocket_icon_to_services.up,
    down: migration_20251226_170438_add_rocket_icon_to_services.down,
    name: '20251226_170438_add_rocket_icon_to_services',
  },
  {
    up: migration_20251226_190040_add_generation_costs.up,
    down: migration_20251226_190040_add_generation_costs.down,
    name: '20251226_190040_add_generation_costs',
  },
  {
    up: migration_20251226_193215_cleanup_unused_tables.up,
    down: migration_20251226_193215_cleanup_unused_tables.down,
    name: '20251226_193215_cleanup_unused_tables',
  },
  {
    up: migration_20251231_152050_fix_generation_costs_and_add_checkpoints.up,
    down: migration_20251231_152050_fix_generation_costs_and_add_checkpoints.down,
    name: '20251231_152050_fix_generation_costs_and_add_checkpoints',
  },
  {
    up: migration_20260102_232503_add_industry_landing_pages.up,
    down: migration_20260102_232503_add_industry_landing_pages.down,
    name: '20260102_232503_add_industry_landing_pages',
  },
  {
    up: migration_20260102_232556_add_industry_checkpoints.up,
    down: migration_20260102_232556_add_industry_checkpoints.down,
    name: '20260102_232556_add_industry_checkpoints',
  },
  {
    up: migration_20260102_233056_add_infographic_to_industries.up,
    down: migration_20260102_233056_add_infographic_to_industries.down,
    name: '20260102_233056_add_infographic_to_industries',
  },
  {
    up: migration_20260104_205845_add_search_collection.up,
    down: migration_20260104_205845_add_search_collection.down,
    name: '20260104_205845_add_search_collection',
  },
  {
    up: migration_20260104_210423_add_excerpt_to_search.up,
    down: migration_20260104_210423_add_excerpt_to_search.down,
    name: '20260104_210423_add_excerpt_to_search',
  },
  {
    up: migration_20260107_175950_add_article_tags.up,
    down: migration_20260107_175950_add_article_tags.down,
    name: '20260107_175950_add_article_tags',
  },
  {
    up: migration_20260107_233745_add_article_id_to_checkpoints.up,
    down: migration_20260107_233745_add_article_id_to_checkpoints.down,
    name: '20260107_233745_add_article_id_to_checkpoints'
  },
];
