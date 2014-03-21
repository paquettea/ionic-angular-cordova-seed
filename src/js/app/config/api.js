angular.module('scoreboard').config(function(APIProvider){

   APIProvider.connector = 'OfflineConnector'
});