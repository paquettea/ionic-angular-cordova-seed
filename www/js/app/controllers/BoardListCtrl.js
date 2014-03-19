angular.module("scoreboard").controller('BoardListCtrl',
   function(
      $log,
      $stateParams,
      $state,
      $scope,
      API,
      Sports){


      $scope.games = API.listGames();
      $log.log($scope.games );

   });