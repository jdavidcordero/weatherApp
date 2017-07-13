angular.module('weather').factory('CurrentWeather',['$resource','API_KEY',
    function($resource,API_KEY){
        return $resource('http://api.openweathermap.org/data/2.5/weather?q=:q&APPID=:APPID',{ APPID: API_KEY },{
            query:{
                method: 'GET',
                isArray: false
            }
        });
    }
]);


angular.module('weather').factory('ForecastWeather',['$resource','API_KEY',
    function($resource,API_KEY){
        return $resource('http://api.openweathermap.org/data/2.5/forecast?q=:q&APPID=:APPID',{ APPID: API_KEY },{
            query:{
                method: 'GET',
                isArray: false
            }
        });
    }
]);