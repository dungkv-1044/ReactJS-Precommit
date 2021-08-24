import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import ROUTES from "./routes";
import styles from "./App.module.scss";

const NotAuthenticatedRouter = () => {
  return (
    <div className={styles.mainContent}>
      <Router>
        {/* <Header /> */}
        {/* <SideBar /> */}
        <Switch>
          {/* // change code here */}
          {/* <Route path={ROUTES.HOME} exact>
              <HomeScreen /> 
          </Route> */}
          <Route path="/">
            <Redirect to={ROUTES.LOGIN} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default NotAuthenticatedRouter;
