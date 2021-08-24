import axios, { AxiosPromise } from "axios";

export class APIFunctions {
  public static post = <T = unknown>(
    accessToken: string,
    ...args: Parameters<ReturnType<typeof createAxios>["post"]>
  ): AxiosPromise<T> => {
    return createAxios(accessToken).post<T>(...args);
  };
  public static put = <T = unknown>(
    accessToken: string,
    ...args: Parameters<ReturnType<typeof createAxios>["put"]>
  ): AxiosPromise<T> => {
    return createAxios(accessToken).put(...args);
  };
  public static patch = <T = unknown>(
    accessToken: string,
    ...args: Parameters<ReturnType<typeof createAxios>["patch"]>
  ): AxiosPromise<T> => {
    return createAxios(accessToken).patch<T>(...args);
  };
  public static get = <T = unknown>(
    accessToken: string,
    ...args: Parameters<ReturnType<typeof createAxios>["get"]>
  ): AxiosPromise<T> => {
    return createAxios(accessToken).get(...args);
  };
  public static delete = <T = unknown>(
    accessToken: string,
    ...args: Parameters<ReturnType<typeof createAxios>["delete"]>
  ): AxiosPromise<T> => {
    return createAxios(accessToken).delete(...args);
  };
}

export enum ENV {
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
}

type EnvSelection = {
  [k in ENV]: string;
};

// đổi domain ở đây
const envSelection: EnvSelection = {
  [ENV.DEVELOPMENT]: "https://jsonplaceholder.typicode.com",
  [ENV.STAGING]: "https://example.com/staging",
  [ENV.PRODUCTION]: "https://example.com/production",
};

const createAxios = (accessToken: string) => {
  return axios.create({
    baseURL: envSelection[process.env.REACT_APP_ENV as keyof EnvSelection],
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": accessToken,
    },
  });
};
