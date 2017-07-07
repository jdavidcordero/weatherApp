angular.module('weatherapp').config(['$locationProvider','$routeProvider',
    function config($locationProvider,$routeProvider){
        $locationProvider.hashPrefix('!');

        $routeProvider.
            when('/currentWeather',{
                template: '<current-weather></current-weather>'
            }).
            when('/currentWeather/:countryId',{
                template: '<current-weather></current-weather>'
            }).
            when('/forecastWeather',{
                template: '<forecast-weather></forecast-weather>'
            }).
            when('/forecastWeather/:countryId',{
                template: '<forecast-weather></forecast-weather>'
            }).
            otherwise('/currentWeather');
    }
]);