import { IAgent } from './HttpAgent/IAgent';
import { ApiMethod } from './types/ApiMethod';
import { ErrorConfig } from './types/ErrorConfig';
import { Request } from './types/Request';
import { RequestBaseConfig } from './types/RequestBaseConfig';



export class HttpBaseClient {
  // Current service HTTP Agent witch used for request calls
  private httpAgent: IAgent;


  // Endpoint prefix
  // Example: <https://domain.com/api>/auth/request
  // <https://domain.com/api> -- prefix
  private baseURL: string;

  // Request endpoint
  private url?: string;


  // Default method
  // If method is not passed, then apply default method
  private defaultMethod?: ApiMethod;

  // Request method (POST/GET/etc)
  private method?: ApiMethod;


  // Request body
  private data?: any;


  // Default headers for each request
  private defaultHeaders: Record<string, string> = {};

  // Request headers
  // Example: { 'Content-Type': 'application/json' }
  private headers: Record<string, string> = {};


  // Errors defined outside of service
  private errorsConfig: ErrorConfig[] = [];


  // Current request status
  private status: Request<any> = { status: 'init' };

  // Utils flag
  // I used singleton for this class
  // so you need to reset before new request call
  private isResetedBeforeCall: boolean = true;



  // Setup default properties
  constructor(config: RequestBaseConfig, agent: IAgent) {
    this.baseURL = config.baseURL || '';
    this.defaultMethod = config.defaultMethod;
    this.errorsConfig = config.errorsConfig || [];

    // Store default headers
    // and immediately assign
    if (config.defaultHeaders) {
      this.defaultHeaders = config.defaultHeaders;
      Object.assign(this.headers, config.defaultHeaders);
    }

    this.httpAgent = agent;
  }


  /**
   * Setup Request URL.
   *
   * @param url Request URL.
   */
  public setURL(url: string): HttpBaseClient {
    this.url = this.baseURL + url;
    return this;
  }


  /**
   * Set current request METHOD.
   *
   * @param method request METHOD>
   */
  public setMethod(method: ApiMethod): HttpBaseClient {
    this.method = method;
    return this;
  }


  /**
   * Set current request Headers.
   *
   * @param headers request Headers.
   */
  public setHeaders(headers: Record<string, string>): HttpBaseClient {
    Object.assign(this.headers, headers);
    return this;
  }


  /**
   * Set current request data.
   * @param data Request body.
   */
  public setData<RequestType>(data: RequestType): HttpBaseClient {
    this.data = data;
    return this;
  }


  /**
   * Setup errors with statuses and messages.
   * @param config Array with { status, message }.
   */
  public setErrorsConfig(config: ErrorConfig[]): HttpBaseClient {
    this.errorsConfig = [...this.errorsConfig, ...config];
    return this;
  }


  /**
   * Reset Client.
   */
  public reset(): HttpBaseClient {
    this.url = undefined;
    this.method = undefined;
    this.headers = { ...this.defaultHeaders };
    this.data = undefined;
    this.status = { status: 'init' };
    this.errorsConfig = [];
    this.isResetedBeforeCall = true;
    return this;
  }


  /**
   * Make request call with provided configuration.
   * You need to defined generic types:
   * 1. RequestType
   * 2. ResponseType
   *
   * Return: Promise<Request<ResponseType>>.
   */
  public makeRequest<RequestType, ResponseType>() {
    // Validate: if service resetted before call
    if (!this.isResetedBeforeCall) {
      throw new Error('[HttpBaseClient]: You forgot to reset service.');
    }

    // Validate: Endpoint is provided
    if (!this.url) {
      throw new Error('[HttpBaseClient]: URL option is not provided.');
    }

    // Validate: METHOD is provided
    let method: ApiMethod;
    if (this.method) {
      method = this.method;
    } else if (!this.method && this.defaultMethod) {
      method = this.defaultMethod;
    } else {
      throw new Error('[HttpBaseClient]: METHOD option or Default METHOD are not provided.');
    }

    // Validate: body with POST method
    if (this.method === 'POST' && !this.data) {
      throw new Error('[HttpBaseClient]: You need to provide body with POST method.');
    }

    this.isResetedBeforeCall = false;

    return this.httpAgent.initRequest<RequestType, ResponseType>({
      url: this.url,
      method,
      headers: this.headers,
      data: this.data,
    });
  }
}
