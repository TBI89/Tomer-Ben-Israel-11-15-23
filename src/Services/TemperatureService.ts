import axios from "axios";
import appConfig from "../Utils/AppConfig";
import TemperatureModel from "../Models/TemperatureModel";

class TemperatureService {

    public async getCurrentTemp(locationKey: string): Promise<TemperatureModel[]> {
        const url = appConfig.getCurrentConditionsUrl(locationKey);
        const response = await axios.get<TemperatureModel[]>(url);
        const temperature = response.data;
        return temperature; 
    }
    
}

const temperatureService = new TemperatureService();

export default temperatureService;
