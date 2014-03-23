angular.module("scoreboard.common").directive("countDown",function(){
   return{
      restrict:'AE',
      scope:{
         from : "="
      },
      transclude: true,
      templateUrl : "templates/directives/countDown.html",
      controller: function ($scope,$interval,$element){

         var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

         var timer = null;

         $scope.reset = reset;
         reset();

         function start(){
            if ($scope.remainingTime <= 0){
               reset();
            }

            var countDown,
               start = null,
               countDownInitialValue = $scope.remainingTime;

            function step(timestamp) {
               if (start === null) start = timestamp;
               countDown = countDownInitialValue - (timestamp - start) / 100;

               if (countDown > 0 ){
                  requestAnimationFrame(step);
               }
            }

            requestAnimationFrame(step);

            timer =  $interval( function (){
               //countDown is maintained using requestAnimationFrame since it's based on timestamps (more precise than timeout)
               //we use the timeout to display the values, so we keep on going in scope.$apply to update display
               $scope.remainingTime = countDown;
               if ($scope.remainingTime <= 0){
                  end();
               }
            },100);

            $element.addClass("running").removeClass("stopped");
            $scope.$emit("countdown.start");
         }


         function stop(){
            $interval.cancel(timer);
            timer = null;
            $element.removeClass("running").addClass("stopped");
         }

         function end(){
            stop();
            $element.removeClass("running stopped").addClass("ended");
            $scope.$emit("countdown.end");
         }

         function reset(){
            $scope.remainingTime = $scope.from * 10;
            $element.removeClass("ended");
            $scope.$emit("countdown.reset");
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