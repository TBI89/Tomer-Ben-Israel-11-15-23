import InfoIcon from '@mui/icons-material/Info';
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import FavoritesModel from "../../../Models/FavoritesModel";
import useTitle from "../../../Utils/UseTitle";
import "./Favorites.css";
import notifyService from '../../../Services/NotifyService';

function Favorites(): JSX.Element {

    useTitle("Weather In My Pocket | Favorites");
    const [favorites, setFavorites] = useState<FavoritesModel[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedFavorites = JSON.parse(sessionStorage.getItem("favorites") || "[]");
        if (savedFavorites.length === 0) {
            notifyService.error("Please add cities to your list to view that page");
            navigate("/home/tel-aviv");
        }
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
