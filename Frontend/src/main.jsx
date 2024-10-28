import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import LandingPage from "./Pages/LandingPage";
import SignIn from "./Pages/SignIn";
import AuthProvider from "./Components/Authentication/AuthProvider";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import PostPage from "./Components/Posts/PostPage";
import NotificationList from "./Components/Notifications/NotificationList";
import PostDetails from "./Components/Posts/PostDetails";
import PrivateRoute from "./Components/Authentication/PrivateRoute";
import ForgotPassword from "./Pages/ForgotPassword";

const router = createBrowserRouter([
  {
    path: "/sign-up",
    element: <SignUp />
  },
  {
    path: "/sign-in",
    element: <SignIn />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: "/",
    element: <PrivateRoute>
      <LandingPage />
    </PrivateRoute>,
    children: [
      {
        path: 'home',
        element: <PrivateRoute>
          <Home />
        </PrivateRoute>,
        children: [
          {
            path: 'posts',
            element: <PrivateRoute>
              <PostPage />
            </PrivateRoute>
          },
          {
            path: 'notifications',
            element: <PrivateRoute>
              <NotificationList />
            </PrivateRoute>
          },
          {
            path: 'posts/:postId',
            element: <PrivateRoute>
              <PostDetails />
            </PrivateRoute>
          }
        ]
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);