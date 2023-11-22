import FavoritesModel from '../Models/FavoritesModel';
import { FavoritesActionObject, FavoritesActionType, favoritesStore } from '../Redux/FavoritesState';

class FavoritesService {

    public addToFavorites(city: FavoritesModel): void {
        const favoritesFromStorage = JSON.parse(sessionStorage.getItem('favorites')) || [];
        const isCityInFavorites = favoritesFromStorage.some((fav: FavoritesModel) => fav.cityName === city.cityName);

        if (!isCityInFavorites) {
            const updatedFavorites = [...favoritesFromStorage, city];
            sessionStorage.setItem('favorites', JSON.stringify(updatedFavorites));

            const action: FavoritesActionObject = {
                type: FavoritesActionType.AddToFavorites,
                payload: city,
            };
            favoritesStore.dispatch(action);
        }
    }

    public removeFromFavorites(cityName: string): void {
        const favoritesFromStorage = JSON.parse(sessionStorage.getItem('favorites')) || [];
        const updatedFavorites = favoritesFromStorage.filter((fav: FavoritesModel) => fav.cityName !== cityName);

        sessionStorage.setItem('favorites', JSON.stringify(updatedFavorites));

        const action: FavoritesActionObject = {
            type: FavoritesActionType.RemoveFromFavorites,
            payload: cityName,
        };
        favoritesStore.dispatch(action);
    }

    public isCityInFavorites(cityName: string): boolean {
        const favoritesFromStorage = JSON.parse(sessionStorage.getItem('favorites')) || [];
        return favoritesFromStorage.some((fav: FavoritesModel) => fav.cityName === cityName);
    }
}

const favoritesService = new FavoritesService();

export default favoritesService;
