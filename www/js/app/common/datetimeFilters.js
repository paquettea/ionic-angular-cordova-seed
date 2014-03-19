angular.module("scoreboard.common").filter("secondsFormat",function(){
   return function(seconds){
      var hours = Math.floor(seconds / 3600),
          minutes = Math.floor( (seconds - hours *3600 ) / 60),
          seconds = seconds - ( hours * 3600 ) - (minutes *60 )

      return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
   }
})