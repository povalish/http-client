import { AxiosError, AxiosRequestConfig } from 'axios';
import { RequestBaseConfig } from 'api/types/RequestBaseConfig';
import { AxiosAgent } from './AxiosAgent';



type AuthRequestConfig = AxiosRequestConfig & {
  retry?: boolean;
}


export class AxiosAuthAgent extends AxiosAgent {
  constructor(config: RequestBaseConfig) {
    super(config);

    // Use Auhtorization header for each request
    this.axiosInstance.interceptors.request.use((requestConfig) => {
      const newConfig = { ...requestConfig };
      // TODO: get token from Storage
      const accessToken = 'access';

      if (accessToken) {
        newConfig.headers.Authorization = `Bearer ${accessToken}`;
      }

      return newConfig;
    });

    // Handle 401 error and refresh token
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const originalRequest: AuthRequestConfig = error.config;
        // TODO: get refresh token from Storage
        const refreshToken = 'refresh';

        if (error.response?.status === 401 && !originalRequest.retry) {
          originalRequest.retry = true;

          // return refreshClient({ refresh: refreshToken }).then((resp) => {
          //   if (resp.status === 'loaded') {
          //     saveClient(resp.payload);
          //     this.axiosInstance.defaults.headers.Authorization =
          // `Bearer ${resp.payload.access}`;
          //   }

          //   return this.axiosInstance(originalRequest);
          // });
        }

        return error;
      },
    );
  }
}
