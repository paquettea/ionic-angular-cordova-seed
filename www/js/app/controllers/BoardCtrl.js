angular.module("scoreboard").controller('BoardCtrl',
   function(
      $log,
      $stateParams,
      $state,
      $scope,
      API,
      Sports){

      $scope.game = API.getGame($stateParams.gameId);
      $log.log($scope.game);
   });