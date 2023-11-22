class FavoritesModel {
    public id: number;
    public cityName: string;
    public currentWeather: string;

    constructor(id: number, cityName: string, currentWeather: string) {
        this.id = id;
        this.cityName = cityName;
        this.currentWeather = currentWeather;
    }
}

export default FavoritesModel;
