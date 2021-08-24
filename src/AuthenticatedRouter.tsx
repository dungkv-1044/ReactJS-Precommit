import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import ROUTES from "./routes";
import HomeScreen from "./components/screens/HomeScreen";
import styles from "./App.module.scss";

const AuthenticatedRouter = () => {
  return (
    <div className={styles.mainContent}>
      <Router>
        {/* <Header /> */}
        {/* <SideBar /> */}
        <Switch>
          <Route path={ROUTES.HOME} exact>
            <HomeScreen />
          </Route>
          <Route path="/">
            <Redirect to={ROUTES.HOME} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default AuthenticatedRouter;
