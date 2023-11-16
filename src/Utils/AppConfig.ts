class AppConfig {
    private baseUrl = "https://dataservice.accuweather.com/locations/v1/cities/autocomplete";
    private apiKey = "wTmR0iYDHQ2uxZQlgIOKyLpQBX8tZj38";

    public getLocationsUrl(cityName: string): string {
        return `${this.baseUrl}?q=${cityName}&apikey=${this.apiKey}`;
    }
}

const appConfig = new AppConfig();

export default appConfig;
