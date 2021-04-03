import { HttpBaseClient } from './HttpBaseClient';
import { RequestBaseConfig } from './types/RequestBaseConfig';
import { AxiosAgent } from './HttpAgent/AxiosAgent';


export class HttpClient extends HttpBaseClient {
  constructor(config: RequestBaseConfig) {
    super(config, new AxiosAgent(config));
  }
}


export default new HttpClient({
  baseURL: '',
  defaultHeaders: { 'Content-Type': 'application/json' },
});
