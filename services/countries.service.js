angular.module('countries').factory('Country',['$resource',
    function($resource){
        return $resource('countries/iso_3166-1.json',{},{
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);

angular.module('countries').factory('Divisions',['$resource',
    function($resource){
        return $resource('countries/countries-subdivisions.json',{},{
            query:{
                method: 'GET',
                isArray: false
            }
        });
    }
]);