angular.module("scoreboard").controller('BoardCtrl',
   function(
      $log,
      $stateParams,
      AudioSFX,
      $state,
      $scope,
      API,
      EnvironmentDetection,
      Sports){



      if (EnvironmentDetection.isMobileApp()){
         window.plugins.insomnia.keepAwake(function(){}, function(){alert('Something went wrong while trying to disable sleep mode.')})
      }
      $scope.$on("$destroy",function(){
         if (EnvironmentDetection.isMobileApp()){
            window.plugins.insomnia.allowSleepAgain(function(){}, function(){alert('Something went wrong while trying to re-enable sleep mode.')})
         }
      });
      var scores = document.getElementById("scores");

      $scope.$on("score.change",function(event,element,previousScore, score){
         if (previousScore < score){
            AudioSFX.score($scope.game);
         }
      });

      $scope.$on("countdown.end",function(event,element,score){
         AudioSFX.endOfPeriod($scope.game);
      });

      $scope.game = API.getGame($stateParams.gameId);
      $log.log($scope.game);


   });