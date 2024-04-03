import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NotPermitted from "./not-permitted";

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

  return (
    <>
      {isAuthenticated === true ? (
        <>
          <RoleBaseRoute>{props.children}</RoleBaseRoute>
        </>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};

export default ProtectedRoute;
