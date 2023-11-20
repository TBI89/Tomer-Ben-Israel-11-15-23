import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import FavoritesModel from "../../../Models/FavoritesModel";
import useTitle from "../../../Utils/UseTitle";
import "./Favorites.css";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import notifyService from "../../../Services/NotifyService";

function Favorites(): JSX.Element {

    useTitle("Weather In My Pocket | Favorites");
    const [favorites, setFavorites] = useState<FavoritesModel[]>([]);

    useEffect(() => {
        const savedFavorites = JSON.parse(sessionStorage.getItem("favorites") || "[]");
        setFavorites(savedFavorites);
    }, []);

    function removeMe(id: number) {
        const sure = window.confirm("Are you sure you want to remove this city?")
        if (!sure) return;
        const updatedFavorites = favorites.filter(f => f.id !== id);
        setFavorites(updatedFavorites);
        sessionStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        notifyService.success("The city was removed from your favorites list!");
    }

    return (
        <div className="Favorites">
            {favorites.map(f =>
                <div className="FavoriteCard" key={f.id}>
                    <div className="OptionsContainer">
                        <NavLink to={`/home/${f.cityName}`}><InfoIcon /></NavLink>
                        <button onClick={() => removeMe(f.id)}><DeleteIcon /></button>
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
