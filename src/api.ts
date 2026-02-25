import axios, { AxiosResponse } from 'axios';
import { config } from './config';

/**
 * Generic function to fetch data from API endpoints
 * @param url - API endpoint URL
 * @returns Promise resolving to API response
 * @throws Error if API request fails
 */
export async function fetchData<T>(url: string): Promise<AxiosResponse<T>> {
  try {
    return await axios.get<T>(url);
  } catch (error) {
    console.error(config.MESSAGE_ERROR.DATA_FETCH, error);
    throw error;
  }
}
