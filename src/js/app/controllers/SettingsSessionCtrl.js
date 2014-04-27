angular.module("scoreboard").controller('SettingsSessionCtrl',
    function(
        $log,
        $stateParams,
        $state,
        $scope,
        $ionicNavBarDelegate,
        API,
        Sports){


        $scope.getPreviousTitle =function(){
            debugger;
            $ionicNavBarDelegate.getPreviousTitle();
        }
    });
