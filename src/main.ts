import { MergedChamp } from 'wildrift-merged-champion-types';
import { fetchData } from './api';
import { config } from './config';
import { convertToMergedStats } from './edit';
import { createOutputDirectory, writeJsonFile } from './file';
import { CNChampionStats } from './types/cnApi';

async function main(): Promise<void> {
  try {
    // Create output directory at the beginning
    await createOutputDirectory();

    // Fetch CN API stats and champion data in parallel
    const [cnApiResponse, championDataResponse] = await Promise.all([
      fetchData<CNChampionStats>(config.CN_API_URL),
      fetchData<MergedChamp[]>(config.CHAMPION_DATA_URL),
    ]);

    // Use the stats date from CN API data (format: "YYYYMMDD"), falling back to current date
    const firstEntry = Object.values(cnApiResponse.data.data['0'] ?? {})?.[0]?.[0];
    const rawDate = firstEntry?.dtstatdate ?? '';
    // Parse YYYYMMDD → ISO 8601 (insert dashes: "2026-02-25")
    const date =
      rawDate.length === 8
        ? new Date(
            `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}T00:00:00Z`,
          ).toISOString()
        : new Date().toISOString();

    // Convert CN API format to merged format
    const mergedStats = convertToMergedStats(cnApiResponse.data, championDataResponse.data, date);

    // Write the merged stats to JSON
    await writeJsonFile(mergedStats);

    console.log(config.MESSAGE_SUCCESS.PROCESS_COMPLETE);
  } catch (error) {
    console.error(config.MESSAGE_ERROR.PROCESS_ERROR, error);
    process.exit(1);
  }
}

main();
