/**
 * Handle game data locally. No data sent to external services whatsoever
 */
angular.module('scoreboard.api').factory('OfflineConnector',function(KeepIt){
   var OfflineConnector,
       gameDataStorage = KeepIt.getModule('OfflineConnector',KeepIt.types.PERSISTENT);

   return OfflineConnector = {
      createGame: function(gameParams){

         gameDataStorage.put(gameParams.gameId,gameParams);
         return gameParams.gameId;
      },
      getGame : function (gameId){
         return gameDataStorage.getValue(gameId);
      },
      listGames: function(){
         window.gameDataStorage =gameDataStorage;
         var list = [],
            keys = gameDataStorage.getAllKeys();

         angular.forEach(keys,function(v,key){
            list.push(gameDataStorage.getValue(key));
         });

         return list;
      }
   }
});