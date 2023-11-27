class AppConfig {
    public apiKey?: string;
    public baseUrl?: string;
    private locationsUrl = "locations/v1/cities/autocomplete";
    private currentConditionsUrl = "currentconditions/v1/";
    private forecastsUrl = "forecasts/v1/daily/5day/";

    public constructor(apiKey?: string, baseUrl?: string) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

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

const developmentConfig = new AppConfig();
const productionConfig = new AppConfig("wTmR0iYDHQ2uxZQlgIOKyLpQBX8tZj38", "https://dataservice.accuweather.com/");
const appConfig = process.env.NODE_ENV === "production" ? productionConfig : developmentConfig;

export default appConfig;
