angular.module("scoreboard.common").factory("AudioSFX",function($rootScope){

   var AudioSFX;
      player = document.createElement("audio"),
      playing = null,
      lastPlayedScore = null,
      SFX ={
         END_OF_PERIOD : "end-of-period/end-of-period.mp3",
         SCORE : "score/Hockey NHL - Home Goal Air Horn.mp3"
      };

   //player.style.display("none");
   player.onended = function(){
      AudioSFX.cancel();
      $rootScope.$apply();
   };
   function play (file,sport){
      player.src = "audio/" + sport + "/" + file;
      playing = file;
      player.play();
      $rootScope.$broadcast(AudioSFX.EVENTS.START);
   }

   return AudioSFX = {
      EVENTS : {
         START : "AudioSFX.pley",
         END   : "AudioSFX.stop"
      },
      delayForScoreReplay : 90,
      cancel : function(){
         player.pause();
         $rootScope.$broadcast(AudioSFX.EVENTS.END);
      },
      listenForSFX: function(){
      },
      playRandom : function(){

      },
      endOfPeriod:function(game){
         play(SFX.END_OF_PERIOD,game.sport);
      },
      score:function(game){

         if (lastPlayedScore == null ||  playing !== SFX.SCORE || (playing === SFX.SCORE && new Date().getTime() > lastPlayedScore.getTime() + AudioSFX.delayForScoreReplay *1000 ) ){
            lastPlayedScore = new Date();
            play(SFX.SCORE,game.sport);
         }
      }
   }
});