import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NotPermitted from "./not-permitted";
import Loading from "./loading";

const RoleBaseRoute = (props) => {
  const user = useSelector((state) => state.auth.user);
  const userRole = user.role.name;

  if (userRole !== "NORMAL_USER") {
    return <>{props.children}</>;
  } else {
    return <NotPermitted />;
  }
};

const ProtectedRoute = (props) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector(state => state.auth.isLoading)

  return (
    <>
      {isLoading === true ?
        <Loading />
        :
        <>
          {isAuthenticated === true ?
            <>
              <RoleBaseRoute>
                {props.children}
              </RoleBaseRoute>
            </>
            :
            <Navigate to='/login' replace />
          }
        </>
      }
    </>
  );
};

export default ProtectedRoute;
