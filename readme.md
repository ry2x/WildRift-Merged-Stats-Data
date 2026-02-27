# WildRift Merged Stats Data API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

League of Legends: Wild Riftのチャンピオン統計データ（勝率・出現率・BAN率など）を提供するAPIです。
毎日自動的にデータが更新されます✨

> 🇺🇸 English version is available [here](./readme_en.md)

データソース:

- 🎮 中国Wild Rift API (`mlol.qt.qq.com`) - ランク帯・レーン別の統計データ
- 👾 [WildRift Merged Champion Data](https://github.com/ry2x/WildRift-Merged-Champion-Data) - チャンピオン情報 (id, key)

---

## エンドポイント 🎯

### ベースURL

```shell
https://ry2x.github.io/WildRift-Merged-Stats-Data
```

### 統計データの取得

```shell
GET /heroStats.json
```

### 使用例

```js
fetch('https://ry2x.github.io/WildRift-Merged-Stats-Data/heroStats.json')
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## データ更新の仕組み 🔄

このAPIのデータは、GitHub Actionsを使って毎日自動的に更新されています💫

### 更新タイミング

- 🕐 毎日02:00 UTC（日本時間11:00）に実行
- 🔄 中国Wild Rift APIとWildRift Merged Champion Dataから最新データを取得
- 📦 統合JSONファイルを生成
- 🚀 `gh-pages` ブランチへ自動デプロイ

### 更新の流れ

1. **データの取得**
   - 中国Wild Rift APIからランク帯・レーン別の統計データを取得
   - WildRift Merged Champion Dataからチャンピオン情報（`id`, `key`）を取得
2. **データの統合**
   - `hero_id` をキーにして両データをマージ
   - CN APIフォーマット（ランク`0-4`・レーン`1-5`）を可読な形式に変換
3. **ファイルの生成**
   - `public/heroStats.json` として出力（minified）
4. **デプロイ**
   - `gh-pages` ブランチへ自動デプロイ
   - GitHub Pagesに即座に反映

### 更新状況の確認

- 🔍 [Actions](https://github.com/ry2x/WildRift-Merged-Stats-Data/actions) タブで更新状況を確認できます
- 🔁 失敗した場合は最大3回まで自動リトライされます

---

## レスポンスの構造 📦

### レスポンス型定義

```ts
type Response = MergedChampionStats;

type MergedChampionStats = {
  /** データの基準日時 (ISO 8601) */
  date: string;
  /** ランク帯・レーン別の統計データ */
  data: {
    [R in Ranks]: {
      [L in Lanes]: MergedHeroStats[];
    };
  };
};

type MergedHeroStats = {
  id: string;             // チャンピオンID (例: "Ahri")
  key: string;            // LOL用チャンピオンキー
  hero_id: string;        // Wild Rift用ヒーローID
  appear_rate_percent: string;  // 出現率 (%)
  appear_rate_bzc: number;      // 出現率ベンチマーク (小さいほど高出現)
  forbid_rate_percent: string;  // BAN率 (%)
  forbid_rate_bzc: number;      // BAN率ベンチマーク (小さいほど高BAN)
  win_rate_percent: string;     // 勝率 (%)
  win_rate_bzc: number;         // 勝率ベンチマーク (小さいほど高勝率)
  strength: number;             // 強さランキング (1=最強, 40=最弱)
  strength_level: number;       // 強さレベル (0=最強, 5=最弱)
};

type Ranks = 'all' | 'diamond_plus' | 'master_plus' | 'challenger_plus' | 'super_server';
type Lanes = 'mid' | 'jungle' | 'top' | 'support' | 'ad';
```

詳しくは [型定義ファイル](./src/types/mergedData.ts) を参照してください。

### レスポンス例

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

## ランク帯・レーン対応表

### ランク帯 (Ranks)

| キー               | 内容              |
| ------------------ | ----------------- |
| `all`              | 全ランク          |
| `diamond_plus`     | ダイヤモンド以上  |
| `master_plus`      | マスター以上      |
| `challenger_plus`  | チャレンジャー以上|
| `super_server`     | スーパーサーバー  |

### レーン (Lanes)

| キー      | 内容         |
| --------- | ------------ |
| `mid`     | ミッドレーン |
| `jungle`  | ジャングル   |
| `top`     | トップレーン |
| `support` | サポート     |
| `ad`      | ADCレーン    |
