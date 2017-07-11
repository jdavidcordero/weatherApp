angular.module('currentWeather').component('currentWeather',{
    templateUrl: 'current-weather/current-weather.template.html',
    controller: ['CountryForm', function currentWeatherController(CountryForm){
        CountryForm.init().then(function(obj){
            this.currentWeather = CountryForm.currentWeather;
            this.temperature = CountryForm.temperature;
            this.minTemperature = CountryForm.minTemperature;
            this.maxTemperature = CountryForm.maxTemperature;
            this.windDirection = CountryForm.windDirection;
            this.sunrise = CountryForm.sunrise;
            this.sunset = CountryForm.sunset;
            this.wikiUrl = CountryForm.wikiUrl;
            this.officialName = CountryForm.officialName;
        });
    }]
});