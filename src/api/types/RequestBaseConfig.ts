import { ApiMethod } from './ApiMethod';
import { ErrorConfig } from './ErrorConfig';

export type RequestBaseConfig = {
  baseURL?: string;
  defaultMethod?: ApiMethod;
  defaultHeaders?: Record<string, string>;
  errorsConfig?: ErrorConfig[];
}
