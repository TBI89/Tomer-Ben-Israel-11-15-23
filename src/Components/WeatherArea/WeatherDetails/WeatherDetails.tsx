import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clearWeatherTextImage from "../../../Assets/Images/clear-current-weather.gif";
import cloudWeatherTextImage from "../../../Assets/Images/cloud-current-weather.gif";
import defaultWeatherTextImage from "../../../Assets/Images/default-current-weather.gif";
import rainWeatherTextImage from "../../../Assets/Images/rain-current-weather.gif";
import snowWeatherTextImage from "../../../Assets/Images/snow-current-weather.gif";
import thunderstormWeatherTextImage from "../../../Assets/Images/thunderstorm-current-weather.gif";
import windWeatherTextImage from "../../../Assets/Images/wind-current-weather.gif";
import sunnyWeatherTextImage from "../../../Assets/Images/sunny-current-weather.gif";
import partlyCloudyWeatherTextImage from "../../../Assets/Images/partly-cloudy-current-weather.gif";
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

function WeatherDetails(): JSX.Element {
    const [location, setLocation] = useState<LocationModel | null>(null);
    const [temperature, setTemperature] = useState<TemperatureModel[]>([]);
    const [forecast, setForecast] = useState<ForecastModel>();
    const [cityInput, setCityInput] = useState<string>("");
    const [favorites, setFavorites] = useState<FavoritesModel[]>([]);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const params = useParams();
    const navigate = useNavigate();

    useTitle("Weather In My Pocket | Home");

    // Data for production:
    // useEffect(() => {
    //     const favoritesFromStorage = JSON.parse(sessionStorage.getItem("favorites")) || [];
    //     const isCityInFavorites = favoritesFromStorage.some((fav: FavoritesModel) => fav.cityName === params.cityName);
    //     setIsFavorite(isCityInFavorites);

    //     fetchLocationData(params.cityName || "tel-aviv");
    //     fetchTemperatureData(params.cityName || "tel-aviv");
    //     fetchForecastData(params.cityName || "tel-aviv");
    // }, [params.cityName]);

    // Data for development (saved locally): 
    useEffect(() => {
        async function getLocalData() {
            const favoritesFromStorage = JSON.parse(sessionStorage.getItem("favorites")) || [];
            const isCityInFavorites = favoritesFromStorage.some((fav: FavoritesModel) => fav.cityName === params.cityName);
            setIsFavorite(isCityInFavorites);

            const locationResponse = await fetch("/AutoCompleteSearch.json");
            const locationData = await locationResponse.json();
            setLocation(locationData[0]);

            const temperatureResponse = await fetch("/CurrentConditions.json");
            const temperatureData = await temperatureResponse.json();
            setTemperature(temperatureData);

            const forecastResponse = await fetch("/FiveDayForecast.json");
            const forecastData = await forecastResponse.json();
            setForecast(forecastData);
        }
        getLocalData();
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

            const isAlreadyInFavorites = favorites.some(fav => fav.cityName === newFavorite.cityName);

            if (isAlreadyInFavorites) {
                const updatedFavorites = favorites.filter(fav => fav.cityName !== newFavorite.cityName);
                setFavorites(updatedFavorites);
                sessionStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                setIsFavorite(false);
                notifyService.success("The city was removed from your favorites!");
            } else {
                setFavorites(prevFavorites => [...prevFavorites, newFavorite]);
                sessionStorage.setItem("favorites", JSON.stringify([...favorites, newFavorite]));
                setIsFavorite(true);
                notifyService.success("The city was added to your favorites!");
            }
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
                onClick={() => saveCityToSessionStorage(cityInput)}
            >
                {isFavorite ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
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
