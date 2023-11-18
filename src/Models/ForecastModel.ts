class ForecastModel {
    public Date: string;
    public Temperature: Temperature;
    public DailyForecasts: DailyForecast[];
}

class Temperature {
    public Minimum: Minimum;
    public Maximum: Maximum;
}

class Minimum {
    public Value: number;
    public Unit: string;
    public UnitType: number;
}

class Maximum {
    public Value: number;
    public Unit: string;
    public UnitType: number;
}

class DailyForecast {
    public Date: string;
    public Temperature: Temperature;
}

export default ForecastModel;