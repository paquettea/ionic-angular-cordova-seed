
angular.module('scoreboard')
   .config(function ($stateProvider, $urlRouterProvider,EnvironmentDetection,AudioSFXProvider) {

      $stateProvider

         // setup an abstract state for the tabs directive
         .state('scoreboard', {
            url: "/scoreboard",
            abstract :true,
            templateUrl: "templates/scoreboard-tabs.html"
         })
         .state('scoreboard.new-game',{
            url: '/new-game',
            views:{
               "new-game-tab":{ //name of the ion-nav-view in which we load data
                 templateUrl:"templates/new-game.html",
                  controller : 'NewGameCtrl'
               }
            }

         })

         .state('scoreboard.list', {
            url: '/board/list',
            views: {
               'game-tab': {
                  templateUrl: 'templates/board-list.html',
                  controller: 'BoardListCtrl'
               }
            }
         })
         .state('scoreboard.board', {
            url: '/board/:gameId',
            autoHideTabs :true,
            views: {
               'game-tab': {
                  templateUrl: 'templates/board.html',
                  controller: 'BoardCtrl'
               }
            }
         })

         .state('reset', {
            url: '/reset',
            views: {
               'reset-tab': {
                  templateUrl: 'templates/reset.html',
                  controller: 'ResetCtrl'
               }
            }
         })
        .state('scoreboard.settings',{
            url: '/settings',
            views: {
              'settings-tab': {
                  templateUrl: 'templates/settings/settings.html',
                  controller:function(){
                  }
              }
            }
        })
         .state('scoreboard.settings-session', {
            url: '/settings-session',
            views: {
               'settings-tab': {
                  templateUrl: 'templates/settings/session.html',
                  controller: 'SettingsSessionCtrl'
               }
            }
         })
          .state('scoreboard.settings-remote',{
              url: '/settings-remote',
              views: {
                  'settings-tab': {
                      templateUrl: 'templates/settings/remote.html',
                      controller: 'SettingsRemoteCtrl'
                  }
              }
          })
         .state('scoreboard.settings-ui', {
            url: '/settings-ui',
            views: {
               'settings-tab': {
                  templateUrl: 'templates/settings/ui.html',
                  controller: 'SettingsUiCtrl'
               }
            }
         })
        .state('scoreboard.settings-sounds', {
            url: '/settings-sounds',
            views: {
              'settings-tab': {
                  templateUrl: 'templates/settings/sounds.html',
                  controller: 'SettingsSoundsCtrl'
              }
            }
        })


         .state('scoreboard.settings-about', {
            url: '/settings-about',
            views: {
               'settings-tab': {
                  templateUrl: 'templates/settings/about.html'
               }
            }
         });

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/scoreboard/new-game');

      if (EnvironmentDetection.isMobileApp()){
         AudioSFXProvider.setInterface("CordovaMedia");
      }else{
         AudioSFXProvider.setInterface("HTML5Audio");
      }
   });

