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
    path: "/",
    element: <LandingPage />,
    children: [
      {
        path: 'home',
        element: <Home />,
        children: [
          {
            path: 'posts',
            element: <PostPage />
          },
          {
            path: 'notifications',
            element: <NotificationList />
          },
          {
            path: 'posts/:postId',
            element: <PostDetails />
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