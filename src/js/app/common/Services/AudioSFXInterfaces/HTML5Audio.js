angular.module("scoreboard.common").factory("HTML5Audio",function($rootScope,AudioSFXEvents){
   var HTML5Audio,
      player = document.createElement("audio");

   player.onended = function(){
      HTML5Audio.stop();
      $rootScope.$apply();
   };

   return HTML5Audio = {

      play:function(src){
         player.src = src;
         player.play();
      },
      pause:function(){
         player.pause();
      },
      stop:function(){
         player.pause();
         $rootScope.$broadcast(AudioSFXEvents.END);
      },
      mute:function(){

      }
   }
});