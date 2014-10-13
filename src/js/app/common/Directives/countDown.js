angular.module("scoreboard.common").directive("countDown",function(){
   return{
      restrict:'AE',
      scope:{
         from : "=",
         autostart: "="
      },
      transclude: true,
      templateUrl : "templates/directives/countDown.html",
      controller: function ($scope,$interval,$element,$log){

         var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

         var timer = null;

         $scope.reset = reset;
         reset();
         stop();

         $scope.$watch("from",function(value){
            console.log("--------------changed ", value);
            if($scope.autostart === true){
               reset();
               start();
            }
         });


         function start(){
            if ($scope.remainingTime <= 0){
               reset();

            }

            if ( $scope.remainingTime == $scope.from * 10 ){
                $scope.$emit("countdown.start");
            }else{
                $scope.$emit("countdown.resume");
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

         }


         function stop(){
            $interval.cancel(timer);
            $scope.$emit("countdown.stop");
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
            $log.log("reset to ", $scope.remainingTime)
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

      },
      link : function (scope){


      }
   }
});