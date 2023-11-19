class AppConfig {
    private apiKey = "wTmR0iYDHQ2uxZQlgIOKyLpQBX8tZj38";
    private baseUrl = "https://dataservice.accuweather.com/"
    private locationsUrl = "locations/v1/cities/autocomplete";
    private currentConditionsUrl ="currentconditions/v1/";
    private forecastsUrl = "forecasts/v1/daily/5day/";

    public getLocationsUrl(cityName: string): string {
        return `${this.baseUrl}${this.locationsUrl}?q=${cityName}&apikey=${this.apiKey}`;
    }

    public getCurrentConditionsUrl(locationKey: string): string {
        return `${this.baseUrl}${this.currentConditionsUrl}${locationKey}?apikey=${this.apiKey}&language=en-us&details=false`;
    }

    public getForecastsUrl(locationKey: string): string {
        return `${this.baseUrl}${this.forecastsUrl}${locationKey}?apikey=${this.apiKey}&language=en-us&details=false`;
    }
}

const appConfig = new AppConfig();

export default appConfig;
