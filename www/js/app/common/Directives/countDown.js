angular.module("scoreboard.common").directive("countDown",function(){
   return{
      restrict:'AE',
      scope:{
         from : "="
      },
      templateUrl : "templates/directives/countDown.html",
      controller: function ($scope,$interval,$element){
         var timer = null;
         $scope.remainingTime = $scope.from;

         function start(){
            timer =  $interval( function (){
               $scope.remainingTime--

               if ($scope.remainingTime == 0){
                  stop();
               }
            },1000);

            $element.addClass("running").removeClass("stopped");
         }

         function stop(){
            $interval.cancel(timer);
            timer = null;
            $element.removeClass("running").addClass("stopped");
         }
         $scope.toggleState = function(){

            if (timer !== null){
               stop();
            }else{
               start();
            }

         }

         stop();

      },
      link : function (scope){


      }
   }
});