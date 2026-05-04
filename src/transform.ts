import { MergedChamp } from 'wildrift-merged-champion-types';
import { CNChampionStats, CNHeroStats, CNLane, CNRankRange } from './types/cnApi';
import { Lanes, MergedChampionStats, MergedHeroStats, Ranks } from './types/mergedData';

/**
 * Mapping from CN API rank range to our Ranks type.
 * CN API: 0=ALL, 1=Dia+, 2=Mas+, 3=Ch+, 4=Super Server
 */
const RANK_MAP: Record<CNRankRange, Ranks> = {
  '0': 'all',
  '1': 'diamond_plus',
  '2': 'master_plus',
  '3': 'challenger_plus',
  '4': 'super_server',
};

/**
 * Mapping from CN API lane ID to our Lanes type.
 * CN API: 1=mid, 2=top, 3=ad, 4=support, 5=jungle
 */
const LANE_MAP: Record<CNLane, Lanes> = {
  '1': 'mid',
  '2': 'top',
  '3': 'ad',
  '4': 'support',
  '5': 'jungle',
};

/**
 * Builds a lookup map from hero_id (as string) to ChampionData.
 * Filters out champions not available in Wild Rift or with no hero_id.
 *
 * @param championData - Array of champion data from ddragon/WR merged source
 * @returns Map keyed by hero_id string
 */
function buildChampionMap(championData: MergedChamp[]): Map<string, MergedChamp> {
  return new Map(
    championData.filter((c) => c.is_wr && c.hero_id > 0).map((c) => [String(c.hero_id), c]),
  );
}

/**
 * Converts a single CNHeroStats entry into MergedHeroStats.
 * Returns null if no matching champion data is found for the hero_id.
 *
 * @param cnStats - Raw hero stats from CN API
 * @param championMap - Lookup map built by buildChampionMap
 * @returns Converted MergedHeroStats, or null if champion not found
 */
function convertHeroStats(
  cnStats: CNHeroStats,
  championMap: Map<string, MergedChamp>,
): MergedHeroStats | null {
  const champion = championMap.get(cnStats.hero_id);
  if (!champion) return null;

  return {
    id: champion.id,
    key: String(champion.key),
    hero_id: cnStats.hero_id,
    appear_rate_percent: cnStats.appear_rate_percent,
    appear_rate_bzc: parseInt(cnStats.appear_bzc, 10),
    forbid_rate_percent: cnStats.forbid_rate_percent,
    forbid_rate_bzc: parseInt(cnStats.forbid_bzc, 10),
    win_rate_percent: cnStats.win_rate_percent,
    win_rate_bzc: parseInt(cnStats.win_bzc, 10),
    strength: parseInt(cnStats.strength, 10),
    strength_level: parseInt(cnStats.strength_level, 10),
  };
}

/**
 * Converts CNChampionStats (CN API format) to MergedChampionStats.
 * Merges CN API data with champion identity data (id, key) from ddragon source.
 *
 * @param cnStats - Full CN API champion stats
 * @param championData - Champion data array from WildRift-Merged-Champion-Data
 * @param date - ISO 8601 date string for the stats (e.g., "2026-02-25T00:00:00Z")
 * @returns Merged stats indexed by rank and lane
 */
export function convertToMergedStats(
  cnStats: CNChampionStats,
  championData: MergedChamp[],
  date: string,
): MergedChampionStats {
  const championMap = buildChampionMap(championData);

  // Initialize the result structure with empty arrays for every rank/lane combination
  const emptyLanes = (): Record<Lanes, MergedHeroStats[]> => ({
    mid: [],
    jungle: [],
    top: [],
    support: [],
    ad: [],
  });

  const result: MergedChampionStats = {
    date,
    data: {
      all: emptyLanes(),
      diamond_plus: emptyLanes(),
      master_plus: emptyLanes(),
      challenger_plus: emptyLanes(),
      super_server: emptyLanes(),
    },
  };

  for (const rankKey of Object.keys(cnStats.data) as CNRankRange[]) {
    const rank = RANK_MAP[rankKey];
    if (!rank) continue;

    const laneStats = cnStats.data[rankKey];

    for (const laneKey of Object.keys(laneStats) as CNLane[]) {
      const lane = LANE_MAP[laneKey];
      if (!lane) continue;

      const heroStatsList: CNHeroStats[] = laneStats[laneKey];

      result.data[rank][lane] = heroStatsList
        .map((s) => convertHeroStats(s, championMap))
        .filter((s): s is MergedHeroStats => s !== null);
    }
  }

  return result;
}
