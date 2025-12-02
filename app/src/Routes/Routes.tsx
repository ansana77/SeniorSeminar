import {
    createBrowserRouter,
} from "react-router-dom";
import App from "../App";
import LandingPage from "../Body/LandingPage/LandingPage";
import { Map } from "../Body/MapView/Mapview";
import { SubmitRestroom } from "../Body/SubmitRestroom/SubmitRestroom";
import { Login } from "../Body/Login/Login";
import { Signup } from "../Body/Login/Signup";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: "submitRestroom", element: <SubmitRestroom /> },
            { path: "map", element: <Map /> },
            { path: "login", element: <Login /> },
            { path: "signup", element: <Signup /> },
        ],
    },
])