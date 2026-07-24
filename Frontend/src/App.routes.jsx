import { createBrowserRouter, Navigate } from "react-router-dom"; // 👈 Yahan Navigate add kar diya hai
import Login from "./features/auth/pages/Login";
import Resgister from "./features/auth/pages/Resgister";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Resgister />
    },
    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/interview/:reportID",
        element: <Protected><Interview /></Protected>
    },
    {
        // Catch-all route: Kisi unknown URL par automated login redirect
        path: "*",
        element: <Navigate to="/login" replace />
    }
]);