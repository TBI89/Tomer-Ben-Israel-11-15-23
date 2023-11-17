import React, { useEffect, useState } from "react";
import "./WeatherDetails.css";
import LocationModel from "../../../Models/LocationModel";
import { useParams, useNavigate } from "react-router-dom";
import locationsService from "../../../Services/LocationsService";
import notifyService from "../../../Services/NotifyService";
import TemperatureModel from "../../../Models/TemperatureModel";
import temperatureService from "../../../Services/TemperatureService";

function WeatherDetails(): JSX.Element {
    const [location, setLocation] = useState<LocationModel | null>(null);
    const [temperature, setTemperature] = useState<TemperatureModel[]>([]);
    const [cityInput, setCityInput] = useState<string>("");
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchLocationData(params.cityName || "DefaultCityName");
        fetchTemperatureData(params.cityName || "DefaultCityName");
    }, [params.cityName]);

    function fetchLocationData(cityName: string) {
        locationsService.getOneCity(cityName)
            .then(locations => setLocation(locations[0]))
            .catch(err => notifyService.error(err));
    };

    function fetchTemperatureData(cityName: string) {
        locationsService.getOneCity(cityName)
            .then(locations => {
                const locationKey = locations[0]?.Key;
                if (locationKey) {
                    temperatureService.getCurrentTemp(locationKey)
                        .then(temperatures => setTemperature(temperatures))
                }
                else {
                    notifyService.error("Error fetching temperature data");
                }
            })
            .catch(err => notifyService.error(err));
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newCityName = cityInput.trim() !== "" ? cityInput : "DefaultCityName";
        navigate(`/home/${newCityName}`);
    };

    const administrativeAreaName = location?.LocalizedName;
    
    return (
        <div className="WeatherDetails">

            <nav className="navbar bg-body-tertiary">
                <div className="container-fluid">
                    <form className="d-flex" role="search" onSubmit={handleSearch}>
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Enter city name"
                            aria-label="Search"
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                        />
                        <button className="btn btn-outline-success" type="submit">
                            Search
                        </button>
                    </form>
                </div>
            </nav>
            <div className="LocationDataContainer">
                {administrativeAreaName ? (
                    <>
                        <h2>{administrativeAreaName}</h2>
                        {temperature.length > 0 ? (
                            temperature.map((temp, index) => (
                                <p key={index}>Temperature: {temp.Temperature.Metric.Unit}°{temp.Temperature.Metric.Value}</p>
                            ))
                        ) : (
                            <p>Loading temperature...</p>
                        )}
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default WeatherDetails;
