import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Resgister from "./features/auth/pages/Resgister";


export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Resgister/>
    }
])