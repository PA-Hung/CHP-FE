import App from "@/App";
import { createBrowserRouter } from "react-router-dom";
import LayoutAdmin from "./LayoutAdmin";
import UserPage from "@/components/user/user.page";
import ProtectedRoute from "@/router/protectedRoute";
import Login from "@/components/auth/login.page";
import AccommodationPage from "@/components/accommodation/accommodation.page";
import AdminPage from "@/components/admin/admin.page";
import RolePage from "@/components/role/role.page";
import PermissionPage from "@/components/permission/permission.page";
import ApartmentPage from "@/components/apartment/apartment.page";
import NotFound from "./not.found";
import BookingPage from "@/components/bookings/booking.page";
import MotorsPage from "@/components/motors/motors.page";
import CalenderTimeLine from "@/components/rental_schedule/calenderTimeline.page";
import ReportPage from "@/components/report/report.page";
import GuestPage from "@/components/guest/guest.page";
import MaintenancesPage from "@/components/maintenances/maintenances.page";

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
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "rental_schedule",
        element: (
          <ProtectedRoute>
            <CalenderTimeLine />
          </ProtectedRoute>
        ),
      },
      {
        path: "guests",
        element: (
          // <ProtectedRoute>
          <GuestPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: "motors",
        element: (
          // <ProtectedRoute>
          <MotorsPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: "maintenances",
        element: (
          // <ProtectedRoute>
          <MaintenancesPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <ProtectedRoute>
            <ReportPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
