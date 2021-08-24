import React from "react";
import { DashboardContext, fetchPosts } from "../../../context/dashboard";
// import styles from "./HomeScreen.module.scss";

const HomeScreen = () => {
  const { dashboardState, dashboardDispatch } =
    React.useContext(DashboardContext);
  React.useEffect(() => {
    dashboardDispatch(fetchPosts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("==", dashboardState.posts);

  return (
    <div>
      <h3>Home</h3>
      <div>
        {dashboardState.posts?.map((i) => {
          return <p key={i.id}>{i.title}</p>;
        })}
      </div>
    </div>
  );
};

export default HomeScreen;
