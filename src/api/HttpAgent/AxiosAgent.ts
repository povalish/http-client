import axios, { AxiosError, AxiosInstance } from 'axios';

import { RequestBaseConfig } from 'api/types/RequestBaseConfig';
import { RequestConfig } from 'api/types/RequestConfig';
import { Request } from 'api/types/Request';
import { ErrorConfig } from 'api/types/ErrorConfig';
import { IAgent } from './IAgent';



export class AxiosAgent implements IAgent {
  // I think it is 'best practice' to create axios instance
  protected axiosInstance: AxiosInstance;

  // Errors with statuses and messages.
  protected errorsConfig: ErrorConfig[] = [];

  // Configure axios
  constructor(config: RequestBaseConfig) {
    this.axiosInstance = axios.create({
      headers: config.defaultHeaders,
      baseURL: config.baseURL,
      method: config.defaultMethod,
    });
  }


  public initRequest<RequestType, ResponseType>(
    config: RequestConfig<RequestType>,
  ): Promise<Request<ResponseType>> {
    //
    // Call axios with provided config
    //
    return this.axiosInstance({
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data,
    }).then((response) => {
      // If error from response from server
      if (response.data.detail) {
        return { status: 'error', error: new Error(response.data.detail) } as Request<ResponseType>;
      }

      return { status: 'loaded', payload: response.data } as Request<ResponseType>;
    }).catch((axiosError: AxiosError) => {
      // Match any status codes with error config
      const foundError = this.errorsConfig.find(
        (error) => error.status === axiosError.response?.status,
      );

      // If error was founded
      // return error request status
      if (foundError) {
        return { status: 'error', error: new Error(foundError.message) } as Request<ResponseType>;
      }

      return { status: 'error', error: axiosError } as Request<ResponseType>;
    });
  }
}
