'use strict';

angular.module('hhApp')
.controller('CategoryCtrl', function ($scope, $http, $log, $routeParams, modalProvider, $window, $sce) {

    $scope.events = [];
    $scope.eventsName = "";
    $scope.eventsLead = "";
    $scope.hasSubcategories = false;
    $scope.inSubcategoryListing = false;

    (function(){

        var promise = $scope.req = $http.get('json/'+ $routeParams.categoryId +'.json');
        promise
        .success(function(data){

            if (data.subcategories) {
                $scope.subcategories = data.subcategories;
                $scope.hasSubcategories = true;
            }

            $scope.parentEventsName = $scope.eventsName = data.name;
            $scope.parentEvents = $scope.events = data.events;
            $scope.parentEventsLead = $scope.eventsLead = $sce.trustAsHtml(data.lead);

        })

        .error(function(){

        });

    })();

    $scope.openModal =  function(event){
        modalProvider.openModal(event);
    };

    $scope.openUrl = function(url){
        if( url && url.length > 0 ){
			var win = $window.open(url, '_blank');
			win.focus();
		}
    };

    $scope.selectSubCategory = function(subcategory){

        $scope.selectedSubCategory = subcategory;
        $scope.inSubcategoryListing = true;

        var events = [];

        angular.forEach($scope.events, function(event){
            if(event.belongsTo === subcategory.name) {
                events.push(event);
            }
        });

        $scope.events = events;
        $scope.eventsName += " - "+subcategory.name;
        $scope.eventsLead = subcategory.lead;
        $scope.hasSubcategories = false;

    };

    $scope.back = function(){

        if ($scope.inSubcategoryListing) {
            $scope.hasSubcategories = true;

            $scope.events = [];
            $scope.events = $scope.parentEvents;
            $scope.eventsLead = $scope.parentEventsLead;
            $scope.eventsName = $scope.parentEventsName;

            $scope.inSubcategoryListing = false;

        }else{
            $window.history.back();
        }

    };

});
