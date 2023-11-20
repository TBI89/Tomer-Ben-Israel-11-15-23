import InfoIcon from '@mui/icons-material/Info';
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import FavoritesModel from "../../../Models/FavoritesModel";
import useTitle from "../../../Utils/UseTitle";
import "./Favorites.css";

function Favorites(): JSX.Element {

    useTitle("Weather In My Pocket | Favorites");
    const [favorites, setFavorites] = useState<FavoritesModel[]>([]);

    useEffect(() => {
        const savedFavorites = JSON.parse(sessionStorage.getItem("favorites") || "[]");
        setFavorites(savedFavorites);
    }, []);

    return (
        <div className="Favorites">
            {favorites.map(f =>
                <div className="FavoriteCard" key={f.id}>
                    <div className="OptionsContainer">
                        <NavLink to={`/home/${f.cityName}`}><InfoIcon /></NavLink>
                    </div>
                    <div className="ContentContainer">
                        <h3>{f.cityName}</h3>
                        <h3>{f.currentWeather}</h3>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Favorites;
