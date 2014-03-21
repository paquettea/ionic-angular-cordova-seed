angular.module("scoreboard").controller('NewGameCtrl',
   function(
      $log,
      $state,
      $scope,
      API,
      Sports){

   $scope.gameParams = Sports.hockey.getGameParameters();
   $scope.increaseStep = function ( prop, increment){
      var closestStep = Math.floor( prop / increment);
      return (increment * closestStep) + increment;
   };
   $scope.decreaseStep = function ( prop, increment){
      var closestStep = Math.floor( (prop-1 + increment) / increment);
      return Math.max(1,(increment * closestStep) - increment);
   };

   $scope.createGame = function(){
      var gameId = API.createGame($scope.gameParams);
      $state.go('scoreboard.board',{gameId: gameId});
   };
});