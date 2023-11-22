import { createStore } from 'redux';
import FavoritesModel from '../Models/FavoritesModel';

export class FavoritesState {
    public favorites: FavoritesModel[] = [];
}

export enum FavoritesActionType {
    AddToFavorites = 'AddToFavorites',
    RemoveFromFavorites = 'RemoveFromFavorites',
}

export interface FavoritesActionObject {
    type: FavoritesActionType;
    payload: FavoritesModel | string;
}

export function favoritesReducer(currentState = new FavoritesState(), action: FavoritesActionObject): FavoritesState {
    const newState = { ...currentState };

    switch (action.type) {
        case FavoritesActionType.AddToFavorites:
            newState.favorites = [...newState.favorites, action.payload as FavoritesModel];
            break;

        case FavoritesActionType.RemoveFromFavorites:
            const cityNameToRemove = action.payload;
            newState.favorites = newState.favorites.filter(city => city.cityName !== cityNameToRemove);
            break;
    }

    return newState;
}

export const favoritesStore = createStore(favoritesReducer);
