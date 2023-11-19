import useTitle from "../../../Utils/UseTitle";
import "./Favorites.css";

function Favorites(): JSX.Element {

    useTitle("Weather In My Pocket | Favorites");

    return (
        <div className="Favorites">
            <h2>Favorites Page</h2>
        </div>
    );
}

export default Favorites;
