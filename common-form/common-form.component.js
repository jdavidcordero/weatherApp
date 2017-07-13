angular.module('commonForm').component('commonForm',{
    templateUrl: 'common-form/common-form.template.html',
    controller: ['CountryForm','$rootScope',function commmonFormController(CountryForm,$rootScope){
        var self = this;
        self.form = CountryForm;
        
        CountryForm.init().then(function(form){
            self.selectedCountry = form.selectedCountry;
            self.getDivisionsFromCountry = function getDivisionsFromCountry(selectedCountry){
                form.getDivisionsFromCountry(selectedCountry);
                self.countryDivisions = form.countryDivisions;
                self.selectedDivision = form.selectedDivision;
            }
            self.countries = form.countries;
            self.orderByName = 'officialName';
            self.selectedDivision = form.selectedDivision;
            self.getWeatherFromDivision = function getWeatherFromDivision(selectedDivision){
                form.getWeatherFromDivision(selectedDivision).then(function(res){},function(error){
                    self.ErrorMessage = error;
                    $('#errorAlert').removeClass('hidden');
                });
            }
            self.countryDivisions = form.countryDivisions;
        },function(error){
            self.ErrorMessage = error;
            $('#errorAlert').removeClass('hidden');
        });

        self.closeErrorAlert = function closeErrorAlert(){
            $('#errorAlert').addClass('hidden');
        }
    }]
});