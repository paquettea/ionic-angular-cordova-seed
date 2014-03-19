angular.module('scoreboard.common',[]);
angular.module('scoreboard.api',['KeepIt']);
angular.module('scoreboard',[
   'ionic',
   'KeepIt',
   'scoreboard.common',
   'scoreboard.api']);
