# WildRift Merged Stats Data API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An API providing champion statistics for League of Legends: Wild Rift (win rate, pick rate, ban rate, and more).
Data is updated automatically every day✨

> 🇯🇵 Japanese version is available [here](./readme.md)

Data sources:

- 🎮 China Wild Rift API (`mlol.qt.qq.com`) - Per-rank and per-lane champion statistics
- 👾 [WildRift Merged Champion Data](https://github.com/ry2x/WildRift-Merged-Champion-Data) - Champion identity data (id, key)

---

## Endpoint 🎯

### Base URL

```shell
https://ry2x.github.io/WildRift-Merged-Stats-Data
```

### Fetch Stats Data

```shell
GET /heroStats.json
```

### Example

```js
fetch('https://ry2x.github.io/WildRift-Merged-Stats-Data/heroStats.json')
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## How Data Updates Work 🔄

Data is automatically refreshed every day using GitHub Actions💫

### Update Schedule

- 🕐 Runs daily at 02:00 UTC (11:00 JST)
- 🔄 Fetches latest data from the China Wild Rift API and WildRift Merged Champion Data
- 📦 Generates a merged JSON file
- 🚀 Auto-deploys to the `gh-pages` branch

### Update Flow

1. **Fetch data**
   - Retrieve per-rank and per-lane champion stats from the China Wild Rift API
   - Retrieve champion identity data (`id`, `key`) from WildRift Merged Champion Data
2. **Merge data**
   - Join the two sources using `hero_id` as the key
   - Convert CN API format (rank `0–4`, lane `1–5`) into human-readable keys
3. **Generate file**
   - Output as `public/heroStats.json` (minified)
4. **Deploy**
   - Auto-deploy to the `gh-pages` branch
   - Changes are reflected on GitHub Pages immediately

### Monitoring Updates

- 🔍 Check the [Actions](https://github.com/ry2x/WildRift-Merged-Stats-Data/actions) tab for update status
- 🔁 Automatically retried up to 3 times on failure

---

## Response Structure 📦

### Type Definitions

```ts
type Response = MergedChampionStats;

type MergedChampionStats = {
  /** Reference date of the statistics (ISO 8601) */
  date: string;
  /** Stats indexed by rank tier and lane */
  data: {
    [R in Ranks]: {
      [L in Lanes]: MergedHeroStats[];
    };
  };
};

type MergedHeroStats = {
  id: string;                   // Champion ID (e.g., "Ahri")
  key: string;                  // LoL champion key
  hero_id: string;              // Wild Rift hero ID
  appear_rate_percent: string;  // Pick rate (%)
  appear_rate_bzc: number;      // Pick rate benchmark (lower = higher pick rate)
  forbid_rate_percent: string;  // Ban rate (%)
  forbid_rate_bzc: number;      // Ban rate benchmark (lower = higher ban rate)
  win_rate_percent: string;     // Win rate (%)
  win_rate_bzc: number;         // Win rate benchmark (lower = higher win rate)
  strength: number;             // Strength ranking (1 = strongest, 40 = weakest)
  strength_level: number;       // Strength level (0 = strongest, 5 = weakest)
};

type Ranks = 'all' | 'diamond_plus' | 'master_plus' | 'challenger_plus' | 'super_server';
type Lanes = 'mid' | 'jungle' | 'top' | 'support' | 'ad';
```

### Response Example

```json
{
  "date": "2026-02-25T00:00:00.000Z",
  "data": {
    "diamond_plus": {
      "mid": [
        {
          "id": "Ahri",
          "key": "103",
          "hero_id": "10038",
          "appear_rate_percent": "12.34%",
          "appear_rate_bzc": 5,
          "forbid_rate_percent": "8.21%",
          "forbid_rate_bzc": 3,
          "win_rate_percent": "51.23%",
          "win_rate_bzc": 12,
          "strength": 3,
          "strength_level": 1
        }
      ]
    }
  }
}
```

---

## Rank & Lane Reference

### Ranks

| Key                | Description       |
| ------------------ | ----------------- |
| `all`              | All ranks         |
| `diamond_plus`     | Diamond+          |
| `master_plus`      | Master+           |
| `challenger_plus`  | Challenger+       |
| `super_server`     | Super Server      |

### Lanes

| Key       | Description |
| --------- | ----------- |
| `mid`     | Mid lane    |
| `jungle`  | Jungle      |
| `top`     | Top lane    |
| `support` | Support     |
| `ad`      | AD Carry    |

---

## License

[MIT](./LICENSE)
