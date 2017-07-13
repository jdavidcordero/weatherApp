angular.module('commonForm').factory('CountryForm',['Country','Divisions','CurrentWeather','ForecastWeather','$q','$rootScope',function(Country,Divisions,CurrentWeather,ForecastWeather,$q,$rootScope){
    var form = new Object();
    form.orderByName = 'officialName';  //ORDER COUNTRIES BY NAME

    form.getAllCountries = function getAllCountries(){
        var deferred = $q.defer();

        Country.get(function(allCountries){
            form.pureCountries = allCountries;
            var res = $.map(allCountries, function(element){ 
                return element; 
            });

            res.splice(250,8);
            deferred.resolve(res);
        });

        return deferred.promise;
    }

    form.getAllDivisions = function getAllDivisions(){
        var deferred = $q.defer();

        Divisions.get(function(allDivisions){
            deferred.resolve(allDivisions);
        });

        return deferred.promise;
    }

    form.getCurrentWeather = function getCurrentWeather(selectedDivision){ //FUNCTION TO GET CURRENT WEATHER OF A DIVISION
        var deferred = $q.defer();
        CurrentWeather.get({q: selectedDivision+','+form.selectedCountry},function(currentWeather){
            deferred.resolve(currentWeather);
        },function(error){
            deferred.reject(error);
        });

        return deferred.promise;
    }

    form.getForecastWeather = function getForecastWeather(selectedDivision){ //FUNCTION TO GET CURRENT WEATHER OF A DIVISION
        var deferred = $q.defer();
        ForecastWeather.get({q: selectedDivision+','+form.selectedCountry},function(forecastWeather){
            deferred.resolve(forecastWeather);
        },function(error){
            deferred.reject(error);
        });

        return deferred.promise;
    }

    form.init = function init(){
        var deferred = $q.defer();
        if(form.selectedCountry !== undefined && form.selectedDivision !== undefined){
            deferred.resolve(form);
            return deferred.promise;
        }
        
        form.getAllCountries().then(function(res){
            form.countries = res;  //ALL THE COUNTRIES TO FILL THE SELECT
            form.selectedCountry = res[0].alpha2;  //COUNTRY SELECTED BY DEFAULT IN SELECT
            form.wikiUrl = res[0].wikiUrl; //URL TO KNOW MORE ABOUT THE COUNTRY
            form.officialName = res[0].officialName; //OFFICIAL NAME OF COUNTRY 

            form.getAllDivisions().then(function(allDivisions){
                form.allDivisions = allDivisions;
                form.getDivisionsFromCountry(form.selectedCountry).then(function(result){
                    deferred.resolve(result);
                });
            })
        });

        return deferred.promise;
    }

    form.getDivisionsFromCountry = function getDivisionsFromCountry(selectedCountry){
        var deferred = $q.defer();

        var divisionsByCountryCode = form.allDivisions[selectedCountry].divisions;
        form.countryDivisions = $.map(divisionsByCountryCode, function(element){ //ALL DIVISIONS OF A COUNTRY TO FILL THE SELECT
            return element;
        });
        form.selectedCountry = selectedCountry;
        form.wikiUrl = form.pureCountries[selectedCountry].wikiUrl; //SET URL TO KNOW MORE ABOUT THE COUNTRY WHEN COUNTRY CHANGES
        form.officialName = form.pureCountries[selectedCountry].officialName; //SET OFFICIAL NAME OF COUNTRY WHEN COUNTRY CHANGES


        form.selectedDivision = form.countryDivisions[0];
        form.getCurrentWeatherFromDivision(form.selectedDivision).then(function(res){
            deferred.resolve(res);
        });

        return deferred.promise;
    }

    form.getCurrentWeatherFromDivision = function getCurrentWeatherFromDivision(selectedDivision){
        var deferred = $q.defer();
        form.getCurrentWeather(selectedDivision).then(function(currentWeather){
            if(currentWeather.sys.country === form.selectedCountry){
                form.currentWeather = currentWeather; // CURRENT WEATHER INFORMATION OF A DIVISION
                form.sunrise = parseDate(form.currentWeather.sys.sunrise);
                form.sunset = parseDate(form.currentWeather.sys.sunset);
                form.temperature = parseTemperature(form.currentWeather.main.temp);
                form.minTemperature = parseTemperature(form.currentWeather.main.temp_min);
                form.maxTemperature = parseTemperature(form.currentWeather.main.temp_max);
                form.windDirection = parseDirection(form.currentWeather.wind.deg);
                
                form.getForecastWeather(selectedDivision).then(function(forecastWeather){
                    form.forecastWeather = forecastWeather;
                    form.forecastWeather.list = forecastWeather.list.slice(0,6);
                    form.forecastWeather.name = form.currentWeather.name;
                    form.forecastWeather.country = form.selectedCountry;
                    forecastWeather.list.slice(0,6).forEach(function(forecast,index){
                        form.forecastWeather.list[index].dt_txt = parseDate2(forecast.dt_txt);
                        form.forecastWeather.list[index].main.temp = parseTemperature(forecast.main.temp);
                        form.forecastWeather.list[index].main.temp_min = parseTemperature(forecast.main.temp_min);
                        form.forecastWeather.list[index].main.temp_max = parseTemperature(forecast.main.temp_max);
                        form.forecastWeather.list[index].wind.windDirection = parseDirection(forecast.wind.deg);
                    });

                    deferred.resolve(form);
                    $rootScope.$broadcast('cityChange');

                },function(error){
                    deferred.reject('Division not found. Sorry');
                });
            }
        },function(error){
            deferred.reject('Division not found. Sorry');
        });

        return deferred.promise;
    }

    return form;

    //-------------------------------------------- HELPER FUNCTIONS --------------------------------------------//
    function parseDate(unix_timestamp){
        var date = new Date(unix_timestamp*1000);

        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();

        return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

    function parseDate2(dt_tex){
        var fullDate = new Date(dt_tex);
        
        var arrayDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        var arrayMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        var date = fullDate.getDate();
        var month = arrayMonth[fullDate.getMonth()];
        var day = arrayDay[fullDate.getDay()];

        return day + ' ' + date + ' ' + month;
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