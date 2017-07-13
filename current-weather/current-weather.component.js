angular.module('currentWeather').component('currentWeather',{
    templateUrl: 'current-weather/current-weather.template.html',
    controller: ['CountryForm','$rootScope', function currentWeatherController(CountryForm,$rootScope){
        var self = this;

        CountryForm.init().then(function(form){
            setCurrentWeather();
        });

        $rootScope.$on('cityChange',function(event, args) {
            setCurrentWeather();
        });

        function setCurrentWeather(){
            self.currentWeather = CountryForm.currentWeather;
            self.temperature = CountryForm.temperature;
            self.minTemperature = CountryForm.minTemperature;
            self.maxTemperature = CountryForm.maxTemperature;
            self.windDirection = CountryForm.windDirection;
            self.sunrise = CountryForm.sunrise;
            self.sunset = CountryForm.sunset;
            self.wikiUrl = CountryForm.wikiUrl;
            self.officialName = CountryForm.officialName;
        }
    }]
});