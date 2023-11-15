import { Navigate, Route, Routes } from "react-router-dom";
import PageNotFound from "../PageNotFound/PageNotFound";
import Favorites from "../../WeatherArea/Favorites/Favorites";
import WeatherData from "../../WeatherArea/WeatherData/WeatherData";

function Routing(): JSX.Element {
    return (
        <Routes>
            <Route path="/weather" element={<WeatherData />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/" element={<Navigate to="/weather" />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}

export default Routing;
