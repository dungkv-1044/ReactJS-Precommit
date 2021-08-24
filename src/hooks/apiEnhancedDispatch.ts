import { useReducer, useMemo } from "react";
import { AxiosError, AxiosPromise, AxiosRequestConfig } from "axios";

export interface Action {
  type: string;
  payload?: {
    request?: Request;
    data?: unknown;
    params?: unknown;
    error?: unknown;
  };
}
interface Request {
  path: string;
  method: string;
  data?: {
    [key: string]: string | number | boolean;
  };
}
export interface State {
  accessToken: string;
}

export interface ApiFunctions {
  post: (
    accessToken: string,
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => AxiosPromise;
  patch: (
    accessToken: string,
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => AxiosPromise;
  get: (
    accessToken: string,
    url: string,
    config?: AxiosRequestConfig
  ) => AxiosPromise;
  delete: (
    accessToken: string,
    url: string,
    config?: AxiosRequestConfig
  ) => AxiosPromise;
  put: (
    accessToken: string,
    path: string,
    data: { [key: string]: string | number | boolean } | undefined
  ) => AxiosPromise;
}

export const useReducerWithApiEnhancedDispatch = <T, K>(args: {
  functions: ApiFunctions;
  converter?: <T>(data: T) => T;
  reducer: React.Reducer<T, K>;
  initialState: T;
}): [T, React.Dispatch<K>] => {
  const [reduceState, dispatch] = useReducer(args.reducer, args.initialState);
  const accessToken = (reduceState as T & State).accessToken;
  const dispatchEnhanced = useMemo(
    () => (ac: unknown) => {
      const action = ac as K & Action;
      if (!action.payload || !action.payload.request) {
        dispatch(action);
        return;
      }
      const request = action.payload.request;
      const beginType = action.type;
      const successType = `${action.type}_SUCCESS`;
      const failType = `${action.type}_FAILURE`;
      const startAction = { type: beginType, payload: action.payload } as K &
        Action;
      dispatch(startAction);
      const apiPromise = request.method.match(/put/i)
        ? args.functions.put(accessToken, request.path, request.data)
        : request.method.match(/patch/i)
        ? args.functions.patch(accessToken, request.path, request.data)
        : request.method.match(/post/i)
        ? args.functions.post(accessToken, request.path, request.data)
        : request.method.match(/delete/i)
        ? args.functions.delete(
            accessToken,
            request.data
              ? `${request.path}?${new URLSearchParams(
                  request.data as { [key: string]: string }
                )}`
              : request.path
          )
        : args.functions.get(
            accessToken,
            request.data
              ? `${request.path}?${new URLSearchParams(
                  request.data as { [key: string]: string }
                )}`
              : request.path
          );
      apiPromise
        .then((response) => {
          const successAction = {
            payload: {
              data: args.converter
                ? args.converter(response.data)
                : response.data,
              params: { ...request },
            },
            type: successType,
          } as K & Action;
          dispatch(successAction);
          return;
        })
        .catch((error: AxiosError) => {
          if (error.response?.status === 403) {
            const failAction = { type: "LOGOUT" } as K & Action;
            dispatch(failAction);
          }
          const failAction = (
            error.response?.status && error.response?.status < 500
              ? {
                  payload: {
                    params: { ...request },
                    error: {
                      code: error.response.data.code as string,
                      status: error.response?.status,
                      message: error.response.data.message as string,
                    },
                  },
                  type: failType,
                }
              : {
                  payload: {
                    params: { ...request },
                    error: {
                      code: "",
                      status: error.response?.status,
                      message: error.message,
                    },
                  },
                  type: failType,
                }
          ) as K & Action;
          dispatch(failAction);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessToken]
  );
  return [reduceState, dispatchEnhanced];
};
