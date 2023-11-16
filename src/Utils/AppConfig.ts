class AppConfig {
    private baseUrl = "https://dataservice.accuweather.com/locations/v1/cities/autocomplete";

    public getLocationsUrl(cityName: string): string {
        return `${this.baseUrl}?q=${cityName}`;
    }
}

const appConfig = new AppConfig();

export default appConfig;
