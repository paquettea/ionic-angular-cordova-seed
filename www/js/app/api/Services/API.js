/**
 * Connects to whatever methods implemented to log game data.
 */
angular.module("scoreboard.api").provider("API",function(){
   var APIProvider;
   return APIProvider = {
      connector : "OfflineConnector",
      $get : function(KeepIt,$injector){
         var connectorService,
             API;

         function loadConnector(){
            $injector.invoke([APIProvider.connector,function(connector){
               connectorService = connector;
            }]);
         }


         loadConnector();
         return API = {
            createGame : function(gameParams){
               gameParams.gameId = "game_"  + new Date().getTime();//moment().format('YYYY-MM-DD-HH-mm-ss');
               gameParams.createdAt = new Date();
               var gameId = connectorService.createGame(gameParams);
               return gameId;
            },
            getGame : function (gameId){
               return connectorService.getGame(gameId);
            },
            updateScore:function (scoreObject){
               return true;
            },
            endGame : function (gameId){
               return true;
            },
            changeConnector: function (newConnector){
               APIProvider.connector = newConnector;
               loadConnector();
            },
            listGames:function(){
               return connectorService.listGames();
            }

         }
      }
   }
});