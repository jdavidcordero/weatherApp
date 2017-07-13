angular.module('forecastWeather').component('forecastWeather',{
    templateUrl: 'forecast-weather/forecast-weather.template.html',
    controller: ['CountryForm','$rootScope',
        function forecastWeatherController(CountryForm,$rootScope){
            var self = this;
        }
    ]
});