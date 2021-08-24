import "./App.css";
import React from "react";
import LoadingScreen from "./components/screens/LoadingScreen";
import { useReducerWithApiEnhancedDispatch } from "./hooks/apiEnhancedDispatch";
import { AuthReducer, AuthContext, InitialAuthState } from "./context/auth";
import {
  DashboardContext,
  InitialDashboardState,
  DashboardReducer,
} from "./context/dashboard";
import { APIFunctions } from "./api/APIFunctions";
import LocalStorage, { LocalStorageKey } from "./local-storage/localStorage";
const App = () => {
  //get access token
  const accessToken = LocalStorage.get(
    LocalStorageKey.ACCESS_TOKEN as LocalStorageKey
  );
  const [authState, authDispatch] = useReducerWithApiEnhancedDispatch({
    functions: APIFunctions,
    reducer: AuthReducer,
    initialState: {
      ...InitialAuthState,
      accessToken: accessToken || "",
      isNotAuth: true,
    },
  });

  const [dashboardState, dashboardDispatch] = useReducerWithApiEnhancedDispatch(
    {
      functions: APIFunctions,
      reducer: DashboardReducer,
      initialState: {
        ...InitialDashboardState,
        accessToken: accessToken || "",
      },
    }
  );

  // resize window
  React.useEffect(() => {
    function updateSize() {
      const doc = document.documentElement;
      doc.style.setProperty("--window-height", `${window.innerHeight}px`);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <AuthContext.Provider value={{ authState, authDispatch }}>
      <DashboardContext.Provider value={{ dashboardState, dashboardDispatch }}>
        <LoadingScreen />
      </DashboardContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
