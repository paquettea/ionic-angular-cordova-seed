angular.module("scoreboard").factory("Sports",function(){

   return {
      hockey:{
         STATES :{
            PERIOD : "PERIOD",
            INTERVAL : "INTERVAL",
            END : "ENDED"

         },
         getGameParameters:function(){
            return {

               sport: 'hockey',//must match the object property name
               periods : {
                  quantity : 3,
                  length : 60 * 20,
                  interval : 60 * 5
               },
               continuousCountdown: true,
               teams:[
                  {
                     name: "Home",
                     color:"#ffffff",
                     score : 0
                  },
                  {
                     name: "Away",
                     color:"#ffffff",
                     score: 0
                  }
               ]
            }
         }
      }
   }
});