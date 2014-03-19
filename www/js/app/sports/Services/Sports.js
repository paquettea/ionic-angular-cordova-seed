angular.module("scoreboard").factory("Sports",function(){

   return {
      hockey:{
         getGameParameters:function(){
            return {
               sport: 'hockey',//must match the object property name
               periods : {
                  quantity : 3,
                  length : 60 * 20,
                  interval : 60 * 5
               },
               continuousCountdown: true
            }
         }
      }
   }
});