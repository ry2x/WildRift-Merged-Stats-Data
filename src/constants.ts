export const MESSAGE_ERROR = {
  FOLDER_CREATE: 'Failed to create output folder❌',
  DATA_FETCH: 'Failed to fetch data❌',
  JSON_WRITE: 'Failed to write JSON file❌',
  PROCESS_ERROR: 'An error occurred during processing❌',
} as const;

export const MESSAGE_SUCCESS = {
  FOLDER_CREATE: 'Successfully created output folder✨',
  JSON_WRITE: 'Successfully wrote JSON file✨',
  PROCESS_COMPLETE: 'All processes completed successfully!🎉',
} as const;
