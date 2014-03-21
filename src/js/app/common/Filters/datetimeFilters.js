angular.module("scoreboard.common").filter("secondsFormat",function(){
   return function(seconds){
      var hours = Math.floor(seconds / 3600),
         minutes = Math.floor( (seconds - hours *3600 ) / 60),
         seconds = seconds - ( hours * 3600 ) - (minutes *60 )


         return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);

   }
});

angular.module("scoreboard.common").filter("splitSecondsFormat",function(){
   return function(split){
      var origSplit = split
      split = parseInt(split);
      var hours = Math.floor(split / 36000),
         minutes = Math.floor( (split - hours *36000 ) / 600),
         seconds = Math.floor((split - ( hours * 36000 ) - (minutes * 600 )) / 10),
         split = Math.floor(split - ( hours * 36000 ) - (minutes * 600 ) - (seconds * 10) )

      if (hours != 0){
         return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
      }else if (minutes != 0){
         return  ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
      }else{
         return  ("0" + seconds).slice(-2) + "." + split ;
      }

   }
})