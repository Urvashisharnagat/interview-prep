import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Resgister from "./features/auth/pages/Resgister";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";

import { AuthProvider } from "./features/auth/auth.context";
import { InterviewProvider } from "./features/interview/Interview.context";

// Root component providing Auth & Interview context inside the Router
const RootLayout = () => {
    return (
        <AuthProvider>
            <InterviewProvider>
                <Outlet />
            </InterviewProvider>
        </AuthProvider>
    );
};

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
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
                path: "*",
                element: <Navigate to="/login" replace />
            }
        ]
    }
]);