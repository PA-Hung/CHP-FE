import App from "@/App";
import { createBrowserRouter } from "react-router-dom";
import LayoutAdmin from "./LayoutAdmin";
import UserPage from "@/components/user/user.page";
import ProtectedRoute from "@/router/protectedRoute";
import Login from "@/components/auth/login.page";
import AccommodationPage from "../components/accommodation/accommodation.page";
import AdminPage from "../components/admin/admin.page";
import RolePage from "../components/role/role.page";
import PermissionPage from "../components/permission/permission.page";
import ApartmentPage from "../components/apartment/apartment.page";
import NotFound from "./not.found";
import BookingPage from "../components/bookings/booking.page";

export const router = createBrowserRouter([
  {
    path: "/",
    // element: <App />,
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "apartment",
        element: (
          <ProtectedRoute>
            <ApartmentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "accommodation",
        element: (
          <ProtectedRoute>
            <AccommodationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "role",
        element: (
          <ProtectedRoute>
            <RolePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "permission",
        element: (
          <ProtectedRoute>
            <PermissionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "bookings",
        element: (
          // <ProtectedRoute>
          <BookingPage />
          // </ProtectedRoute>
        ),
      },
    ],
  },
]);
