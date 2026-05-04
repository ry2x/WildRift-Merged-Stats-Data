import axios, { AxiosResponse } from 'axios';
import { MESSAGE_ERROR } from './constants';

export async function fetchData<T>(url: string): Promise<AxiosResponse<T>> {
  try {
    return await axios.get<T>(url);
  } catch (error) {
    console.error(MESSAGE_ERROR.DATA_FETCH, error);
    throw error;
  }
}
