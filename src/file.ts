import { mkdirSync, writeFileSync } from 'fs';
import { config } from './config';
import { MergedChampionStats } from './types/mergedData';
import { join } from 'path';

/**
 * Creates output directory for storing generated files
 * Creates directory recursively if it doesn't exist
 * @throws Error if directory creation fails
 */
export async function createOutputDirectory(): Promise<void> {
  try {
    mkdirSync(config.OUTPUT_FOLDER_NAME, { recursive: true });
    console.log(config.MESSAGE_SUCCESS.FOLDER_CREATE);
  } catch (error) {
    console.error(config.MESSAGE_ERROR.FOLDER_CREATE, error);
    throw error;
  }
}

/**
 * Writes data to JSON file
 * @param data - Champion data to write
 * @throws Error if file writing fails
 */
export async function writeJsonFile(data: MergedChampionStats): Promise<void> {
  try {
    const outputPath = join(config.OUTPUT_FOLDER_NAME, config.OUTPUT_FILE_NAME);
    writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(config.MESSAGE_SUCCESS.JSON_WRITE);
  } catch (error) {
    console.error(config.MESSAGE_ERROR.JSON_WRITE, error);
    throw error;
  }
}
