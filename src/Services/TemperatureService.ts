import axios from "axios";
import appConfig from "../Utils/AppConfig";
import TemperatureModel from "../Models/TemperatureModel";
import ForecastModel from "../Models/ForecastModel";

class TemperatureService {

    public async getCurrentTemp(locationKey: string): Promise<TemperatureModel[]> {
        const url = appConfig.getCurrentConditionsUrl(locationKey);
        const response = await axios.get<TemperatureModel[]>(url);
        const temperature = response.data;
        return temperature; 
    }

    public async getFiveDayForecast(locationKey: string): Promise<ForecastModel> {
        const url = appConfig.getForecastsUrl(locationKey);
        const response = await axios.get<ForecastModel>(url);
        const forecast = response.data;
        return forecast; 
    }
    
}

const temperatureService = new TemperatureService();

export default temperatureService;
