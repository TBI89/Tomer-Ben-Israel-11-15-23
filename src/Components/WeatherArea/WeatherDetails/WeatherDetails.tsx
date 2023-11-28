import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clearWeatherTextImage from "../../../Assets/Images/clear-current-weather.gif";
import cloudWeatherTextImage from "../../../Assets/Images/cloud-current-weather.gif";
import defaultWeatherTextImage from "../../../Assets/Images/default-current-weather.gif";
import rainWeatherTextImage from "../../../Assets/Images/rain-current-weather.gif";
import snowWeatherTextImage from "../../../Assets/Images/snow-current-weather.gif";
import sunnyWeatherTextImage from "../../../Assets/Images/sunny-current-weather.gif";
import thunderstormWeatherTextImage from "../../../Assets/Images/thunderstorm-current-weather.gif";
import windWeatherTextImage from "../../../Assets/Images/wind-current-weather.gif";
import FavoritesModel from "../../../Models/FavoritesModel";
import ForecastModel from "../../../Models/ForecastModel";
import LocationModel from "../../../Models/LocationModel";
import TemperatureModel from "../../../Models/TemperatureModel";
import locationsService from "../../../Services/LocationsService";
import notifyService from "../../../Services/NotifyService";
import temperatureService from "../../../Services/TemperatureService";
import useTitle from "../../../Utils/UseTitle";
import Spinner from "../../SharedArea/Spinner/Spinner";
import "./WeatherDetails.css";
import favoritesService from '../../../Services/FavoritesService';
import appConfig from '../../../Utils/AppConfig';

function WeatherDetails(): JSX.Element {
    const [location, setLocation] = useState<LocationModel | null>(null);
    const [temperature, setTemperature] = useState<TemperatureModel[]>([]);
    const [forecast, setForecast] = useState<ForecastModel>();
    const [cityInput, setCityInput] = useState<string>("");
    const [isCityInFavorites, setIsCityInFavorites] = useState<boolean>(false);

    const params = useParams();
    const navigate = useNavigate();

    useTitle("Weather In My Pocket | Home");

    useEffect(() => {
        async function fetchData() {
            let locationData, temperatureData, forecastData;
    
            if (appConfig.baseUrl) {
                locationData = await locationsService.getOneCity(params.cityName || "tel-aviv");
                const locationKey = locationData[0]?.Key;

                if (locationKey) {
                    temperatureData = await temperatureService.getCurrentTemp(locationKey);
                    forecastData = await temperatureService.getFiveDayForecast(locationKey);
                } else {
                    notifyService.error("Error fetching temperature data");
                }
            } else {
                const locationResponse = await fetch("/AutoCompleteSearch.json");
                locationData = await locationResponse.json();
    
                const temperatureResponse = await fetch("/CurrentConditions.json");
                temperatureData = await temperatureResponse.json();
    
                const forecastResponse = await fetch("/FiveDayForecast.json");
                forecastData = await forecastResponse.json();
            }

            setLocation(locationData[0]);
    
            const isCityFavorite = favoritesService.isCityInFavorites(locationData[0]?.LocalizedName || "");
            setIsCityInFavorites(isCityFavorite);
    
            setTemperature(temperatureData);
            setForecast(forecastData);
        }
    
        fetchData();
    }, [params.cityName]);

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const newCityName = cityInput.trim() !== "" ? cityInput : "tel-aviv";
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
        if (location && temperature.length > 0) {
            const { WeatherText } = temperature[0] || { WeatherText: "N/A" };
            const { Value, Unit } = temperature[0]?.Temperature?.Metric || { Value: 0, Unit: "C" };

            const newFavorite = new FavoritesModel(
                Date.now(),
                city || "tel-aviv",
                `${WeatherText}, ${Value}° ${Unit}`
            );

            const isAlreadyInFavorites = favoritesService.isCityInFavorites(newFavorite.cityName);

            if (isAlreadyInFavorites) {
                favoritesService.removeFromFavorites(newFavorite.cityName);
                notifyService.success("The city was removed from your favorites!");
            } else {
                favoritesService.addToFavorites(newFavorite);
                notifyService.success("The city was added to your favorites!");
            }
            setIsCityInFavorites(!isAlreadyInFavorites);
        } else {
            notifyService.error("Error fetching data for the favorite city");
        }
    }

    const administrativeAreaName = location?.LocalizedName;

    type WeatherCondition =
        | "Clear"
        | "Sunny"
        | "Cloudy"
        | "Rain"
        | "Thunderstorm"
        | "Snow"
        | "Wind";

    const weatherImageMapping: Record<WeatherCondition, string> = {
        Clear: clearWeatherTextImage,
        Sunny: sunnyWeatherTextImage,
        Cloudy: cloudWeatherTextImage,
        Rain: rainWeatherTextImage,
        Thunderstorm: thunderstormWeatherTextImage,
        Snow: snowWeatherTextImage,
        Wind: windWeatherTextImage
    }

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

            <button
                className="AddToFavoritesButton"
                onClick={() => saveCityToSessionStorage(administrativeAreaName)}
            >
                {favoritesService.isCityInFavorites(administrativeAreaName) ? (
                    <FavoriteIcon fontSize="large" />
                ) : (
                    <FavoriteBorderIcon fontSize="large" />
                )}
            </button>

            <div className="LocationDataContainer">

                {administrativeAreaName ? (
                    <>
                        <h4>{administrativeAreaName}</h4>
                        {temperature.length > 0 ? (
                            temperature.map((temp, index) => (
                                <span key={index}>
                                    <h3>{temp.WeatherText}</h3>
                                    <h2>{temp.Temperature.Metric.Value} °{temp.Temperature.Metric.Unit}</h2>
                                    <img src={weatherImageMapping[temp.WeatherText as WeatherCondition] || defaultWeatherTextImage} alt={temp.WeatherText} />
                                </span>
                            ))
                        ) : (
                            <span>{< Spinner />}</span>
                        )}
                    </>
                ) : (
                    <span>{< Spinner />}</span>
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
                                <img src={weatherImageMapping[dailyForecast.Day.IconPhrase as WeatherCondition] || defaultWeatherTextImage} alt={dailyForecast.Day.IconPhrase} />
                            </span>
                        </div>
                    ))
                ) : (
                    <span>{< Spinner />}</span>
                )}
            </div>

        </div >
    );
}

export default WeatherDetails;