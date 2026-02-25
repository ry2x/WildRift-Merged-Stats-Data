/**
 * Merged hero statistics.
 * Combines HeroStats (ddragon) with CNHeroStats (CN API),
 * normalizing `id` (number → string), `position` (raw string → Lanes).
 *
 * All rate/percentage fields from CNHeroStats (appear_rate_percent, win_rate_percent, etc.)
 * are inherited as-is via Omit spread.
 */
export type MergedHeroStats = {
  /** Champion ID (e.g., "Ahri") from ddragon. */
  id: string;
  /** Champion key for League of Legends from ddragon. */
  key: string;
  /** Hero ID for Wild Rift from CN API. */
  hero_id: string;
  // stats data from CN API
  /** Appearance rate as percentage */
  appear_rate_percent: string;
  /** Appearance rate benchmark: less is more appearance */
  appear_rate_bzc: number;
  /** Ban rate as percentage */
  forbid_rate_percent: string;
  /** Ban rate benchmark: less is more ban */
  forbid_rate_bzc: number;
  /** Win rate as percentage */
  win_rate_percent: string;
  /** Win rate benchmark: less is more win */
  win_rate_bzc: number;
  /** Strength rating (1 to 40): 1 is strongest, 40 is weakest */
  strength: number;
  /** Strength level (0 to 5): 0 is strongest, 5 is weakest */
  strength_level: number;
};

/**
 * Literal types for the lanes.
 */
export type Lanes = 'mid' | 'jungle' | 'top' | 'support' | 'ad';

/**
 * Literal types for the ranks.
 */
export type Ranks = 'all' | 'diamond_plus' | 'master_plus' | 'challenger_plus' | 'super_server';

/**
 * Full merged stats indexed by rank and lane.
 * Example: stats.data['diamond_plus']['mid'] => MergedHeroStats[]
 */
export type MergedChampionStats = {
  /** Date of the statistics in ISO 8601 format: 2026-02-25T00:00:00Z */
  date: string;
  /** Merged hero statistics indexed by rank and lane */
  data: {
    [R in Ranks]: {
      [L in Lanes]: MergedHeroStats[];
    };
  };
};
