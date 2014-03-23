angular.module("scoreboard.common").directive("scorePanel",function(){
   return{
      restrict:'AE',
      scope:{
         teamName : "=",
         score : "="
      },
      templateUrl : "templates/directives/scorePanel.html",
      controller: function ($scope,$interval,$element){
         $scope.increase = function(){
            $scope.score++;
            $scope.$emit("score.change",$element,$scope.score -1,$scope.score)
         };
         $scope.decrease = function(){
            if ($scope.score > 0){
               $scope.score--;
               $scope.$emit("score.change",$element, $scope.score +1,$scope.score)
            }
         };
      },
      link:function (scope,element,attrs){
      }
   }
});