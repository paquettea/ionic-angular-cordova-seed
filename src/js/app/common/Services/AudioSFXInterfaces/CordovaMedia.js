angular.module("scoreboard.common").factory("CordovaMedia",function($rootScope,AudioSFXEvents){
   var CordovaMedia,
       media = null,
       mediaVolume = 1;


   //todo: implement on end
//   player.onended = function(){
//      $rootScope.$broadcast(AudioSFXEvents.END);
//   };

   function onStatusChange(state){
      switch (state){
         case Media.MEDIA_STARTING:
            break;
         case Media.MEDIA_RUNNING:
            break;
         case Media.MEDIA_PAUSED:
            break;
         case Media.MEDIA_STOPPED:
            CordovaMedia.stop();
            break;
         case Media.MEDIA_NONE:
         default:
      }
   }
   return CordovaMedia = {

      play:function(src){
         if (media != null){
            media.release();
         }
         media = new Media(src, function(){
            console.log("done");
         }, function(e){

         }, onStatusChange);
         //media.setVolume(mediaVolume);
         media.play();

      },
      pause:function(){
         media.pause();
      },
      stop:function(){
         media.pause();
         media.release();
         $rootScope.$broadcast(AudioSFXEvents.END);
         $rootScope.$apply();
      },
      mute:function(){
         media.setVolume('0.0');
      },
      unMute:function(){
         media.setVolume(mediaVolume);
      },
      setVolume:function(volume){
         if (volume < 0 || volume > 100){
            throw("Volume should be a percentage");
         }
         mediaVolume = (volume / 100).toFixed(1).toString().replace(",",".");
         media.setVolume(mediaVolume)
      }
   }
});