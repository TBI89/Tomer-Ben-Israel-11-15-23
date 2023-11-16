import { Navigate, Route, Routes } from "react-router-dom";
import PageNotFound from "../PageNotFound/PageNotFound";
import Favorites from "../../WeatherArea/Favorites/Favorites";
import WeatherDetails from "../../WeatherArea/WeatherDetails/WeatherDetails";

function Routing(): JSX.Element {
    return (
        <Routes>
            <Route path="/home/:cityName" element={<WeatherDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/" element={<Navigate to="/home/tel-aviv" />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}

export default Routing;
