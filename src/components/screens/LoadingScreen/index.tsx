import React from "react";
import styles from "./LoadingScreen.module.scss";
import AuthenticatedRouter from "../../../AuthenticatedRouter";
import NotAuthedRoutes from "../../../NotAuthenticatedRouter";

const LoadingScreen = () => {
  // fake logic
  const [state, setState] = React.useState({
    loading: true,
    isAuthed: false,
  });

  // check logic trong màn này để xem user đã login chưa?

  React.useEffect(() => {
    setTimeout(() => {
      setState({ loading: false, isAuthed: true });
    }, 1000);
  }, []);

  if (!state.loading) {
    if (state.isAuthed) {
      return <AuthenticatedRouter />;
    } else {
      return <NotAuthedRoutes />;
    }
  }

  return (
    <div className={styles.loader}>
      <div>
        <p>Loading....</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
