import { RequestConfig } from 'api/types/RequestConfig';
import { RequestBaseConfig } from 'api/types/RequestBaseConfig';
import { Request } from 'api/types/Request';


export interface IAgent {
  initRequest: <RequestType, ResponseType>(
    config: RequestConfig<RequestType>
  ) => Promise<Request<ResponseType>>;
}
