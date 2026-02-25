import { readFileSync } from 'fs';
import { join } from 'path';
import { Config } from './types/config';

/**
 * Loads configuration from config.json file
 * @throws Error if config file cannot be loaded or parsed
 * @returns Parsed configuration object
 */
function loadConfig(): Config {
  try {
    const configPath = join(process.cwd(), 'config.json');
    return JSON.parse(readFileSync(configPath, 'utf8')) as Config;
  } catch (error) {
    console.error('Failed to load config file', error);
    throw error;
  }
}

export const config = loadConfig();
