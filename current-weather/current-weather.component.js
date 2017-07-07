angular.module('currentWeather').component('currentWeather',{
    templateUrl: 'current-weather/current-weather.template.html',
    controller: ['Country','Divisions','CurrentWeather', function currentWeatherController(Country, Divisions,CurrentWeather){
        var self = this;
        Country.get(function(country){
            var res = $.map(country, function(element){ 
                return element; 
            });

            res.splice(250,8);
            self.countries = res;  //ALL THE COUNTRIES
            self.selectedCountry = res[0].alpha2;  //COUNTRY SELECTED BY DEFAULT

            Divisions.get(function(division){
                self.allDivisions = division;  //ALL THE DIVISIONS
                self.getDivisions(self.selectedCountry);
            });
        });

        self.orderByName = 'officialName';  //ORDER COUNTRIES BY NAME
        self.getDivisions = function getDivisions(selectedCountry){  //METHOD TO GET DIVISIONS OF A COUNTRY
            var divisionsByCountryCode = self.allDivisions[selectedCountry].divisions;
            self.countryDivisions = $.map(divisionsByCountryCode, function(element){ //DIVISIONS OF A COUNTRY
                return element;
            });

            self.selectedDivision = self.countryDivisions[0]; //DIVISION SELECTED BY DEFAULT
            self.getCurrentWeather = function getCurrentWeather(selectedDivision){
                CurrentWeather.get({q: selectedDivision+','+self.selectedCountry},function(currentWeather){
                    self.currentWeather = currentWeather;
                });
            }
        }

        
    }]
});