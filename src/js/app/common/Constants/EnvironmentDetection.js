angular.module("scoreboard.common").constant("EnvironmentDetection",{
   isMobileApp : function(){
      return !this.isBrowser();
   },
   isBrowser : function(){
      return typeof cordova == "undefined" || cordova == null;
   }
});