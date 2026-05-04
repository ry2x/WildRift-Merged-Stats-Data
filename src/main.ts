import { MergedChamp } from 'wildrift-merged-champion-types';
import { fetchData } from './api';
import { config } from './config';
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from './constants';
import { createOutputDirectory, writeJsonFile } from './file';
import { convertToMergedStats } from './transform';
import { CNChampionStats } from './types/cnApi';

async function main(): Promise<void> {
  try {
    createOutputDirectory();

    const [cnApiResponse, championDataResponse] = await Promise.all([
      fetchData<CNChampionStats>(config.CN_API_URL),
      fetchData<MergedChamp[]>(config.CHAMPION_DATA_URL),
    ]);

    const firstEntry = Object.values(cnApiResponse.data.data['0'] ?? {})?.[0]?.[0];
    const rawDate = firstEntry?.dtstatdate ?? '';
    const date =
      rawDate.length === 8
        ? new Date(
            `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}T00:00:00Z`,
          ).toISOString()
        : new Date().toISOString();

    const mergedStats = convertToMergedStats(cnApiResponse.data, championDataResponse.data, date);

    writeJsonFile(mergedStats);

    console.log(MESSAGE_SUCCESS.PROCESS_COMPLETE);
  } catch (error) {
    console.error(MESSAGE_ERROR.PROCESS_ERROR, error);
    process.exit(1);
  }
}

main();
