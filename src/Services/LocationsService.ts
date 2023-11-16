import axios from "axios";
import appConfig from "../Utils/AppConfig";
import LocationModel from "../Models/LocationModel";

class LocationsService {

    public async getOneCity(cityName: string): Promise<LocationModel> {
        const url = appConfig.getLocationsUrl(cityName);
        const response = await axios.get<LocationModel>(url);
        const city = response.data;
        return city;
    }
}

const locationsService = new LocationsService();

export default locationsService;
