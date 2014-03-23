angular.module("scoreboard.common").directive("audioSfx",function (AudioSFX){
   return {
      restrict:"E",
      templateUrl : "templates/directives/audioSfx.html",
      link:function(scope){
         scope.isPLaying = false;
         scope.$on(AudioSFX.EVENTS.START,function(){
            scope.isPLaying = true;
         });
         scope.$on(AudioSFX.EVENTS.END,function(){
            scope.isPLaying = false;
         })

         scope.cancel = AudioSFX.cancel;
      }
   }
});