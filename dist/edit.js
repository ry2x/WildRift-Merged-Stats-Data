"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToMergedStats = convertToMergedStats;
const RANK_MAP = {
    '0': 'all',
    '1': 'diamond_plus',
    '2': 'master_plus',
    '3': 'challenger_plus',
    '4': 'super_server',
};
const LANE_MAP = {
    '1': 'mid',
    '2': 'top',
    '3': 'ad',
    '4': 'support',
    '5': 'jungle',
};
function buildChampionMap(championData) {
    return new Map(championData.filter((c) => c.is_wr && c.hero_id > 0).map((c) => [String(c.hero_id), c]));
}
function convertHeroStats(cnStats, championMap) {
    const champion = championMap.get(cnStats.hero_id);
    if (!champion)
        return null;
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
function convertToMergedStats(cnStats, championData, date) {
    const championMap = buildChampionMap(championData);
    const emptyLanes = () => ({
        mid: [],
        jungle: [],
        top: [],
        support: [],
        ad: [],
    });
    const result = {
        date,
        data: {
            all: emptyLanes(),
            diamond_plus: emptyLanes(),
            master_plus: emptyLanes(),
            challenger_plus: emptyLanes(),
            super_server: emptyLanes(),
        },
    };
    for (const rankKey of Object.keys(cnStats.data)) {
        const rank = RANK_MAP[rankKey];
        if (!rank)
            continue;
        const laneStats = cnStats.data[rankKey];
        for (const laneKey of Object.keys(laneStats)) {
            const lane = LANE_MAP[laneKey];
            if (!lane)
                continue;
            const heroStatsList = laneStats[laneKey];
            result.data[rank][lane] = heroStatsList
                .map((s) => convertHeroStats(s, championMap))
                .filter((s) => s !== null);
        }
    }
    return result;
}
