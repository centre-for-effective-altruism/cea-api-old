angular.module('cea', [
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'angularMoment'
])

.controller('MainController', function($scope, $http, moment) {

    



    // DONATION MODEL
    
    $scope.donations = {};
    $scope.Donation = {};
    $scope.NewDonation = {
        timestamp:moment().format()
    };
    $scope.Donation.create = function(){
        var data = {
            amount: $scope.NewDonation.amount,
            donor: $scope.NewDonation.donor,
            organisation: $scope.NewDonation.organisation,
            timestamp: $scope.NewDonation.timestamp
        }
        $http.post('/api/v1/donations/',data)
        .success(function(data) {
            $scope.donations = data;
            $scope.NewDonation = {
                timestamp:moment().format()
            };
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
    }

    $scope.Donation.read = function(){
        // Get all donations
        $http.get('/api/v1/donations')
        .success(function(data) {
            $scope.donations = data;
            console.log('Donations',data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
    }

    $scope.Donation.delete = function(ID){
        $http.delete('/api/v1/donations/'+ID)
        .success(function(data) {
            $scope.donations = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
    }

    // DONOR MODEL
    
    $scope.donors = {};
    $scope.Donor = {};
    $scope.Donor.create = function(){
        var data = {
            name: $scope.NewDonor.name
        }
        console.log(data)
        $http.post('/api/v1/donors/',data)
        .success(function(data) {
            $scope.donors = data;
            $scope.NewDonor = {}
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
    }

    $scope.Donor.read = function(){
        // Get all donors
        $http.get('/api/v1/donors')
        .success(function(data) {
            $scope.donors = data;
            console.log('Donors',data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
    }

    $scope.Donor.delete = function(ID){
        $http.delete('/api/v1/donors/'+ID)
        .success(function(data) {
            $scope.donors = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
    }

    // ORGANISATION MODEL
    $scope.organisations = {};
    $scope.Organisation = {};

    $scope.Organisation.create = function(){
        var data = {
            slug: $scope.NewOrganisation.slug,
            name: $scope.NewOrganisation.name
        }
        console.log(data)
        $http.post('/api/v1/organisations/',data)
        .success(function(data) {
            $scope.organisations = data;
            $scope.NewOrganisation = {}
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
    }

    $scope.Organisation.read = function(){
        // Get all organisations
        $http.get('/api/v1/organisations')
        .success(function(data) {
            $scope.organisations = data;
            console.log('Organisations',data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
    }

    $scope.Organisation.update = function(slug,data){
        data.slug = data.slug || slug
        $http.put('/api/v1/organisations/',data)
        .success(function(data) {
            $scope.organisations = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
    }

    $scope.Organisation.delete = function(slug){
        $http.delete('/api/v1/organisations/'+slug)
        .success(function(data) {
            $scope.organisations = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
    }

    // TARGETS MODEL
    $scope.targets = {};
    $scope.Target = {};

    $scope.Target.create = function(){
        var data = {
            slug: $scope.NewTarget.slug,
            name: $scope.NewTarget.name
        }
        console.log(data)
        $http.post('/api/v1/targets/',data)
        .success(function(data) {
            $scope.targets = data;
            $scope.NewTarget = {}
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
    }

    $scope.Target.read = function(){
        // Get all targets
        $http.get('/api/v1/targets')
        .success(function(data) {
            $scope.targets = data;
            console.log('Targets',data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
    }

    $scope.Target.update = function(id,data){
        data.id = data.id || id
        console.log(data)
        $http.put('/api/v1/targets/',data)
        .success(function(data) {
            $scope.targets = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
    }

    $scope.Target.delete = function(slug){
        $http.delete('/api/v1/targets/'+slug)
        .success(function(data) {
            $scope.targets = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
    }

    // PROGRESS BAR MODEL
    $scope.Progress = {};
    $scope.progress = {};
    $scope.Progress.read = function(){
        $http.get('/api/v1/progress/')
        .success(function(data) {
            $scope.progress = data;
            console.log('Progress',data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
    }


    $scope.Donor.read()
    $scope.Donation.read()
    $scope.Organisation.read()
    $scope.Target.read()
    $scope.Progress.read()

    // watch vars for changes, if
    $scope.$watchGroup(['donations','targets'], function() {
        $scope.Progress.read()
    });


    // datepicker logic 
    $scope.isOpen = false;
     $scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.isOpen = true;
    };


});