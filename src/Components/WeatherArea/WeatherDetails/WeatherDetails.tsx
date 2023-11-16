import { useEffect, useState } from "react";
import "./WeatherDetails.css";
import LocationModel from "../../../Models/LocationModel";
import { useParams } from "react-router-dom";
import locationsService from "../../../Services/LocationsService";
import notifyService from "../../../Services/NotifyService";

function WeatherDetails(): JSX.Element {

    const [location, setLocation] = useState<LocationModel>();
    const params = useParams();

    const cityName = params.cityName;

    useEffect(() => {
        locationsService.getOneCity(cityName)
            .then(location => setLocation(location))
            .catch(err => notifyService.error(err));
    }, [cityName]);

    console.log(location);

    return (
        <div className="WeatherDetails">

            <nav className="navbar bg-body-tertiary">
                <div className="container-fluid">
                    <form className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </nav>

        </div>
    );
}

export default WeatherDetails;
