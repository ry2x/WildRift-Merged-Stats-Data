import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { config } from './config';
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from './constants';
import { MergedChampionStats } from './types/mergedData';

/**
 * Creates output directory for storing generated files.
 * Creates directory recursively if it doesn't exist.
 */
export function createOutputDirectory(): void {
  try {
    mkdirSync(config.OUTPUT_FOLDER_NAME, { recursive: true });
    console.log(MESSAGE_SUCCESS.FOLDER_CREATE);
  } catch (error) {
    console.error(MESSAGE_ERROR.FOLDER_CREATE, error);
    throw error;
  }
}

/**
 * Writes champion stats data to a JSON file.
 */
export function writeJsonFile(data: MergedChampionStats): void {
  try {
    const outputPath = join(config.OUTPUT_FOLDER_NAME, config.OUTPUT_FILE_NAME);
    writeFileSync(outputPath, JSON.stringify(data), 'utf-8');
    console.log(MESSAGE_SUCCESS.JSON_WRITE);
  } catch (error) {
    console.error(MESSAGE_ERROR.JSON_WRITE, error);
    throw error;
  }
}
