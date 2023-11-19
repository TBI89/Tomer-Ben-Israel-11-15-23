import React, { useEffect, useState } from "react";
import "./WeatherDetails.css";
import LocationModel from "../../../Models/LocationModel";
import { useParams, useNavigate } from "react-router-dom";
import locationsService from "../../../Services/LocationsService";
import notifyService from "../../../Services/NotifyService";
import TemperatureModel from "../../../Models/TemperatureModel";
import temperatureService from "../../../Services/TemperatureService";
import ForecastModel from "../../../Models/ForecastModel";
import Spinner from "../../SharedArea/Spinner/Spinner";
import useTitle from "../../../Utils/UseTitle";

function WeatherDetails(): JSX.Element {
    const [location, setLocation] = useState<LocationModel | null>(null);
    const [temperature, setTemperature] = useState<TemperatureModel[]>([]);
    const [forecast, setForecast] = useState<ForecastModel>();
    const [cityInput, setCityInput] = useState<string>("");
    const [favorites, setFavorites] = useState<string[]>([]);
    const params = useParams();
    const navigate = useNavigate();

    useTitle("Weather In My Pocket | Home");

    useEffect(() => {

        const savedFavorites = JSON.parse(sessionStorage.getItem("favorites") || "[]");
        setFavorites(savedFavorites);

        fetchLocationData(params.cityName || "DefaultCityName");
        fetchTemperatureData(params.cityName || "DefaultCityName");
        fetchForecastData(params.cityName || "DefaultCityName");

    }, [params.cityName]);

    function fetchLocationData(cityName: string) {
        locationsService.getOneCity(cityName)
            .then(locations => setLocation(locations[0]))
            .catch(err => notifyService.error(err));
    }

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
    }

    function fetchForecastData(cityName: string) {
        locationsService.getOneCity(cityName)
            .then(locations => {
                const locationKey = locations[0]?.Key;
                if (locationKey) {
                    temperatureService.getFiveDayForecast(locationKey)
                        .then(forecasts => setForecast(forecasts))
                }
                else {
                    notifyService.error("Error fetching forecast data");
                }
            })
            .catch(err => notifyService.error(err));
    }

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const newCityName = cityInput.trim() !== "" ? cityInput : "DefaultCityName";
        navigate(`/home/${newCityName}`);
    }

    function formatDayOfWeek(dateString: string): string {
        const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    function fahrenheitToCelsius(fahrenheit: number): number {
        return ((fahrenheit - 32) * 5) / 9;
    }

    function convertTemperature(temperature: { Value: number; Unit: string }): string {
        const celsiusValue = fahrenheitToCelsius(temperature.Value);
        return `${celsiusValue.toFixed(1)}°C`;
    }

    function saveCityToSessionStorage(city: string) {
        setFavorites(prevFavorites => [...prevFavorites, city]);
        if (city === "") {
            city = "Tel-aviv Port";
        }
        sessionStorage.setItem("favorites", JSON.stringify([...favorites, city]));
    }

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
                            onChange={e => setCityInput(e.target.value)}
                        />
                        <button className="btn btn-outline-primary" type="submit">
                            Search
                        </button>
                    </form>
                </div>
            </nav>

            <button className="AddToFavoritesButton btn btn-primary" onClick={() => saveCityToSessionStorage(cityInput)}>Add To Favorites</button>

            <div className="LocationDataContainer">

                {administrativeAreaName ? (
                    <>
                        <p className="CityNamePlaceholder">{administrativeAreaName}</p>
                        {temperature.length > 0 ? (
                            temperature.map((temp, index) => (
                                <span key={index}>
                                    <p>{temp.Temperature.Metric.Value} °{temp.Temperature.Metric.Unit}</p>
                                    <h2>{temp.WeatherText}</h2>
                                </span>
                            ))
                        ) : (
                            <p>{< Spinner />}</p>
                        )}
                    </>
                ) : (
                    <p>{< Spinner />}</p>
                )}
            </div>

            <div className="ForecastDataContainer">
                {forecast?.DailyForecasts && forecast.DailyForecasts.length > 0 ? (
                    forecast.DailyForecasts.map((dailyForecast, index) => (
                        <div key={index}>
                            <span>
                                <h3>{formatDayOfWeek(dailyForecast.Date)}</h3>
                                <br />
                                <h6>{convertTemperature(dailyForecast.Temperature.Minimum)}
                                    - {convertTemperature(dailyForecast.Temperature.Maximum)}
                                </h6>
                            </span>
                        </div>
                    ))
                ) : (
                    <p>{< Spinner />}</p>
                )}
            </div>

        </div >
    );
}

export default WeatherDetails;
