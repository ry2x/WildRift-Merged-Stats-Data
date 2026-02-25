/**
 *  Config file interface
 */
export interface Config {
  CN_API_URL: string;
  CHAMPION_DATA_URL: string;
  OUTPUT_FOLDER_NAME: string;
  OUTPUT_FILE_NAME: string;
  MESSAGE_ERROR: MessageSet;
  MESSAGE_SUCCESS: MessageSet;
}

/**
 * MessageSet interface
 */
export interface MessageSet {
  FOLDER_CREATE: string;
  DATA_FETCH?: string;
  JSON_WRITE: string;
  DATA_EXPORT?: string;
  PROCESS_ERROR?: string;
  PROCESS_COMPLETE?: string;
}
