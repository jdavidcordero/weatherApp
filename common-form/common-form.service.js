angular.module('commonForm').factory('CountryForm',['Country','Divisions','CurrentWeather','$q',function(Country,Divisions,CurrentWeather,$q){
    var form = new Object();

    form.init = function(){
        var deferred = $q.defer();

        Country.get(function(country){
            form.pureCountries = country;
            var res = $.map(country, function(element){ 
                return element; 
            });

            res.splice(250,8);
            form.countries = res;  //ALL THE COUNTRIES TO FILL THE SELECT
            form.selectedCountry = res[0].alpha2;  //COUNTRY SELECTED BY DEFAULT IN SELECT
            form.wikiUrl = res[0].wikiUrl; //URL TO KNOW MORE ABOUT THE COUNTRY
            form.officialName = res[0].officialName; //OFFICIAL NAME OF COUNTRY

            Divisions.get(function(division){
                form.allDivisions = division;  //ALL THE DIVISIONS
                form.getDivisions(form.selectedCountry);
            });
        });

        form.orderByName = 'officialName';  //ORDER COUNTRIES BY NAME
        form.getDivisions = function getDivisions(selectedCountry){  //FUNCTION TO GET DIVISIONS OF A COUNTRY
            var divisionsByCountryCode = form.allDivisions[selectedCountry].divisions;
            form.countryDivisions = $.map(divisionsByCountryCode, function(element){ //ALL DIVISIONS OF A COUNTRY TO FILL THE SELECT
                return element;
            });
            form.wikiUrl = form.pureCountries[form.selectedCountry].wikiUrl; //SET URL TO KNOW MORE ABOUT THE COUNTRY WHEN COUNTRY CHANGES
            form.officialName = form.pureCountries[form.selectedCountry].officialName; //SET OFFICIAL NAME OF COUNTRY WHEN COUNTRY CHANGES

            form.selectedDivision = form.countryDivisions[0]; //DIVISION SELECTED BY DEFAULT IN SELECT
            form.getCurrentWeather = function getCurrentWeather(selectedDivision){ //FUNCTION TO GET CURRENT WEATHER OF A DIVISION
                CurrentWeather.get({q: selectedDivision+','+form.selectedCountry},function(currentWeather){
                    form.currentWeather = currentWeather; // CURRENT WEATHER INFORMATION OF A DIVISION
                    form.sunrise = parseDate(form.currentWeather.sys.sunrise);
                    form.sunset = parseDate(form.currentWeather.sys.sunset);
                    form.temperature = parseTemperature(form.currentWeather.main.temp);
                    form.minTemperature = parseTemperature(form.currentWeather.main.temp_min);
                    form.maxTemperature = parseTemperature(form.currentWeather.main.temp_max);
                    form.windDirection = parseDirection(form.currentWeather.wind.deg);
                });

                deferred.resolve(true);
            }
            form.getCurrentWeather(form.selectedDivision); //CALLING JUST FOR FIRST TIME
        }

        return deferred.promise; 
    }

    return form;

    //-------------------------------------------- HELPER FUNCTIONS --------------------------------------------//
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

    
}]);