angular.module('forecastWeather').component('forecastWeather',{
    templateUrl: 'forecast-weather/forecast-weather.template.html',
    controller: ['$http',
        function forecastWeatherController($http){
            var self = this;

            $http.get('countries/countries-subdivisions.json').then(function(response){
                self.countries = response.data;
            });
        }
    ]
});