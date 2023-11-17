class TemperatureModel {
    public LocalObservationDateTime: string;
    public EpochTime: number;
    public WeatherText: string;
    public WeatherIcon: number;
    public HasPrecipitation: boolean;
    public PrecipitationType: any;
    public IsDayTime: boolean;
    public Temperature: Temperature;
    public MobileLink: string;
    public Link: string;
}

class Temperature {
    public Metric: Metric;
    public Imperial: Imperial;
}

class Metric {
    public Value: number;
    public Unit: string;
    public UnitType: number;
}

class Imperial {
    public Value: number;
    public Unit: string;
    public UnitType: number;
}

export default TemperatureModel;