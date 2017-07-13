angular.module('forecastWeather').component('forecastWeather',{
    templateUrl: 'forecast-weather/forecast-weather.template.html',
    controller: ['CountryForm','$rootScope',
        function forecastWeatherController(CountryForm,$rootScope){
            var self = this;

            CountryForm.init().then(function(form){
                setForecastWeather();
            });

            $rootScope.$on('cityChange',function(event, args) {
                setForecastWeather();
            });

            function setForecastWeather(){
                self.forecastWeather = CountryForm.forecastWeather;
                self.forecastWeather.name = CountryForm.forecastWeather.name;
                self.forecastWeather.sys.country = CountryForm.forecastWeather.country;
            }
        }
    ]
});