import { ApiMethod } from './ApiMethod';

export type RequestConfig<T> = {
  url: string;
  method: ApiMethod;
  headers?: Record<string, string>;
  data?: T;
}
