angular.module("scoreboard").controller('TabsCtrl',
   function(
      $scope,
      $element,
      $state,
      $timeout
      ){

      var tabs;
      $timeout(function(){
         tabs = angular.element($element[0].querySelector(".tabs"));
      },0);
      $scope.$on("$stateChangeSuccess",function(){
         $timeout(function(){
            if ($state.current.autoHideTabs){
               tabs.addClass("hide");
               console.log("HIDDE");
            }else{
               tabs.removeClass("hide");
            }
         },0);
      })

});