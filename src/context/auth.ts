import React from "react";
import { diff } from "../libs/diff";

export const CLEAR_RESULT = "CLEAR_RESULT";
export const LOGIN = "LOGIN";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";
export const RESET_PASSWORD = "RESET_PASSWORD";

export const login = (username: string, password: string) => {
  return {
    type: LOGIN as typeof LOGIN,
    payload: {
      request: {
        data: {
          username,
          password,
        },
        method: "post",
        path: "signin",
      },
    },
  };
};

export const logout = (errorMessage?: string) => ({
  type: LOGOUT as typeof LOGOUT,
  payload: {
    errorMessage,
  },
});

export const clearResult = () => ({
  type: CLEAR_RESULT as typeof CLEAR_RESULT,
  payload: {},
});

type loginSuccess = {
  type: typeof LOGIN_SUCCESS;
  payload: {
    data: User;
  };
};

type loginFailure = {
  type: typeof LOGIN_FAILURE;
  payload: {
    error: {
      message: string;
      status: number;
    };
  };
};

type logoutSuccess = {
  type: typeof LOGOUT_SUCCESS;
  payload: {
    data: unknown;
  };
};

export type AuthActions =
  | ReturnType<typeof login>
  | ReturnType<typeof logout>
  | ReturnType<typeof clearResult>
  | loginFailure
  | loginSuccess
  | logoutSuccess;

export type AuthState = {
  user?: User;
  accessToken: string;
  isNotAuth: boolean;
  error?: { status: number; message: string };
  result?: string;
};

interface User {
  id: string;
  name: string;
  dob?: string;
}

export const InitialAuthState: AuthState = {
  accessToken: "",
  isNotAuth: false,
};

const reducer = (state: AuthState, action: AuthActions): AuthState => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        result: action.type,
        error: undefined,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        result: action.type,
        error: action.payload.error,
      };
    case LOGOUT: {
      const message = action.payload.errorMessage;
      if (message) {
        return {
          ...InitialAuthState,
          error: { status: 0, message: message },
        };
      }
      return {
        ...InitialAuthState,
      };
    }
    case CLEAR_RESULT:
      return { ...state, result: "", error: undefined };
    default:
      return state;
  }
};

export const AuthReducer =
  process.env.NODE_ENV === "production"
    ? reducer
    : (state: AuthState, action: AuthActions) => {
        console.groupCollapsed(action.type);
        console.log("action", action);
        const result = reducer(state, action);
        console.log("diff", diff(state, result));
        console.log("prevState", state);
        console.log("currentState", result);
        console.groupEnd();
        return result;
      };

type ContextState = {
  authState: AuthState;
  authDispatch(action: AuthActions): void;
};

export const AuthContext = React.createContext<ContextState>({
  authState: InitialAuthState,
  authDispatch(_) {
    console.warn("Context.Provider外からの呼び出し");
  },
});
