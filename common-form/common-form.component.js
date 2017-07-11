angular.module('commonForm').component('commonForm',{
    templateUrl: 'common-form/common-form.template.html',
    controller: ['CountryForm',function commmonFormController(CountryForm){
        CountryForm.init().then(function(obj){
            this.selectedCountry = CountryForm.selectedCountry;
            this.getDivisions = function getDivisions(selectedCountry){
                CountryForm.getDivisions(selectedCountry);
            }
            this.countries = CountryForm.countries;
            this.orderByName = 'officialName';
            this.selectedDivision = CountryForm.selectedDivision;
            this.getCurrentWeather = function getCurrentWeather(selectedDivision){
                CountryForm.getCurrentWeather(selectedDivision);
            }
        });
    }]
});