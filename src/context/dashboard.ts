import React from "react";
import { diff } from "../libs/diff";

export const CLEAR_RESULT = "CLEAR_RESULT";
export const FETCH_POSTS = "FETCH_POSTS";
export const FETCH_POSTS_SUCCESS = "FETCH_POSTS_SUCCESS";
export const FETCH_POSTS_FAILURE = "FETCH_POSTS_FAILURE";

interface Post {
  userId: string;
  id: string;
  title: string;
  body: string;
}

export const fetchPosts = () => {
  return {
    type: FETCH_POSTS as typeof FETCH_POSTS,
    payload: {
      request: {
        method: "get",
        path: "/posts",
      },
    },
  };
};

export const clearResult = () => ({
  type: CLEAR_RESULT as typeof CLEAR_RESULT,
  payload: {},
});

type fetchPostsSuccess = {
  type: typeof FETCH_POSTS_SUCCESS;
  payload: {
    data: Post[];
  };
};

type fetchPostsFailure = {
  type: typeof FETCH_POSTS_FAILURE;
  payload: {
    error: {
      message: string;
      status: number;
    };
  };
};

export type DashboardActions =
  | ReturnType<typeof fetchPosts>
  | ReturnType<typeof clearResult>
  | fetchPostsSuccess
  | fetchPostsFailure;

export type DashboardState = {
  posts?: Post[];
  accessToken: string;
  error?: { status: number; message: string };
  result?: string;
};

export const InitialDashboardState: DashboardState = {
  accessToken: "",
};

const reducer = (
  state: DashboardState,
  action: DashboardActions
): DashboardState => {
  switch (action.type) {
    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        result: action.type,
        posts: action.payload.data,
        error: undefined,
      };
    case FETCH_POSTS_FAILURE:
      return {
        ...state,
        result: action.type,
        error: action.payload.error,
      };
    case CLEAR_RESULT:
      return { ...state, result: "", error: undefined };
    default:
      return state;
  }
};

export const DashboardReducer =
  process.env.NODE_ENV === "production"
    ? reducer
    : (state: DashboardState, action: DashboardActions) => {
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
  dashboardState: DashboardState;
  dashboardDispatch(action: DashboardActions): void;
};

export const DashboardContext = React.createContext<ContextState>({
  dashboardState: InitialDashboardState,
  dashboardDispatch(_) {
    console.warn("Context.Provider外からの呼び出し");
  },
});
