angular.module('currentWeather').component('currentWeather',{
    templateUrl: 'current-weather/current-weather.template.html',
    controller: ['Country','Divisions','CurrentWeather', function currentWeatherController(Country, Divisions,CurrentWeather){
        var self = this;
        Country.get(function(country){
            self.pureCountries = country;
            var res = $.map(country, function(element){ 
                return element; 
            });

            res.splice(250,8);
            self.countries = res;  //ALL THE COUNTRIES TO FILL THE SELECT
            self.selectedCountry = res[0].alpha2;  //COUNTRY SELECTED BY DEFAULT IN SELECT
            self.wikiUrl = res[0].wikiUrl; //URL TO KNOW MORE ABOUT THE COUNTRY
            self.officialName = res[0].officialName; //OFFICIAL NAME OF COUNTRY

            Divisions.get(function(division){
                self.allDivisions = division;  //ALL THE DIVISIONS
                self.getDivisions(self.selectedCountry);
            });
        });

        self.orderByName = 'officialName';  //ORDER COUNTRIES BY NAME
        self.getDivisions = function getDivisions(selectedCountry){  //FUNCTION TO GET DIVISIONS OF A COUNTRY
            var divisionsByCountryCode = self.allDivisions[selectedCountry].divisions;
            self.countryDivisions = $.map(divisionsByCountryCode, function(element){ //ALL DIVISIONS OF A COUNTRY TO FILL THE SELECT
                return element;
            });
            self.wikiUrl = self.pureCountries[self.selectedCountry].wikiUrl; //SET URL TO KNOW MORE ABOUT THE COUNTRY WHEN COUNTRY CHANGES
            self.officialName = self.pureCountries[self.selectedCountry].officialName; //SET OFFICIAL NAME OF COUNTRY WHEN COUNTRY CHANGES

            self.selectedDivision = self.countryDivisions[0]; //DIVISION SELECTED BY DEFAULT IN SELECT
            self.getCurrentWeather = function getCurrentWeather(selectedDivision){ //FUNCTION TO GET CURRENT WEATHER OF A DIVISION
                CurrentWeather.get({q: selectedDivision+','+self.selectedCountry},function(currentWeather){
                    self.currentWeather = currentWeather; // CURRENT WEATHER INFORMATION OF A DIVISION
                    self.sunrise = parseDate(self.currentWeather.sys.sunrise);
                    self.sunset = parseDate(self.currentWeather.sys.sunset);
                    self.temperature = parseTemperature(self.currentWeather.main.temp);
                    self.minTemperature = parseTemperature(self.currentWeather.main.temp_min);
                    self.maxTemperature = parseTemperature(self.currentWeather.main.temp_max);
                    self.windDirection = parseDirection(self.currentWeather.wind.deg);
                });
            }
            self.getCurrentWeather(self.selectedDivision); //CALLING JUST FOR FIRST TIME
        }
        

        //HELPER FUNCTIONS
        function parseDate(unix_timestamp){
            var date = new Date(unix_timestamp*1000);
            // Hours part from the timestamp
            var hours = date.getHours();
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            // Seconds part from the timestamp
            var seconds = "0" + date.getSeconds();

            // Will display time in 10:30:23 format
            return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        }

        function parseTemperature(temperature){
            return parseInt(temperature - 273.15);
        }

        function parseDirection(degrees){
            var val = Math.floor((degrees / 22.5) + 0.5);
            var arr = ["North", "North-northeast", "Northeast", "East-northeast", "East", "East-southeast", "Southeasth", "South-southeast", "South", "South-southwest", "Southwest", "West-southwest", "West", "West-northweast", "Northwest", "North-northwest"];
            var aa = arr[(val % 16)];
            return aa;
        }
    }]
});