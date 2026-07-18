import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Resgister from "./features/auth/pages/Resgister";
import Protected from "./features/auth/components/Protected";


export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Resgister/>
    },
    {
        path:"/",
        element:<Protected><h1>Home Page</h1></Protected>
    }
])