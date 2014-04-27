angular.module('scoreboard.common', []);
angular.module('scoreboard.api', ['KeepIt']);
angular.module('scoreboard', [
  'ionic',
  'KeepIt',
  'scoreboard.common',
  'scoreboard.api'
]);angular.module('scoreboard').run(function () {
});angular.module('scoreboard').config([
  'APIProvider',
  function (APIProvider) {
    APIProvider.connector = 'OfflineConnector';
  }
]);angular.module('scoreboard').config([
  '$stateProvider',
  '$urlRouterProvider',
  'EnvironmentDetection',
  'AudioSFXProvider',
  function ($stateProvider, $urlRouterProvider, EnvironmentDetection, AudioSFXProvider) {
    $stateProvider.state('scoreboard', {
      url: '/scoreboard',
      abstract: true,
      templateUrl: 'templates/scoreboard-tabs.html'
    }).state('scoreboard.new-game', {
      url: '/new-game',
      views: {
        'new-game-tab': {
          templateUrl: 'templates/new-game.html',
          controller: 'NewGameCtrl'
        }
      }
    }).state('scoreboard.list', {
      url: '/board/list',
      views: {
        'game-tab': {
          templateUrl: 'templates/board-list.html',
          controller: 'BoardListCtrl'
        }
      }
    }).state('scoreboard.board', {
      url: '/board/:gameId',
      autoHideTabs: true,
      views: {
        'game-tab': {
          templateUrl: 'templates/board.html',
          controller: 'BoardCtrl'
        }
      }
    }).state('reset', {
      url: '/reset',
      views: {
        'reset-tab': {
          templateUrl: 'templates/reset.html',
          controller: 'ResetCtrl'
        }
      }
    }).state('scoreboard.settings', {
      url: '/settings',
      views: {
        'settings-tab': {
          templateUrl: 'templates/settings/settings.html',
          controller: function () {
          }
        }
      }
    }).state('scoreboard.settings-session', {
      url: '/settings-session',
      views: {
        'settings-tab': {
          templateUrl: 'templates/settings/session.html',
          controller: 'SettingsSessionCtrl'
        }
      }
    }).state('scoreboard.settings-remote', {
      url: '/settings-remote',
      views: {
        'settings-tab': {
          templateUrl: 'templates/settings/remote.html',
          controller: 'SettingsRemoteCtrl'
        }
      }
    }).state('scoreboard.settings-ui', {
      url: '/settings-ui',
      views: {
        'settings-tab': {
          templateUrl: 'templates/settings/ui.html',
          controller: 'SettingsUiCtrl'
        }
      }
    }).state('scoreboard.settings-sounds', {
      url: '/settings-sounds',
      views: {
        'settings-tab': {
          templateUrl: 'templates/settings/sounds.html',
          controller: 'SettingsSoundsCtrl'
        }
      }
    }).state('scoreboard.settings-about', {
      url: '/settings-about',
      views: { 'settings-tab': { templateUrl: 'templates/settings/about.html' } }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/scoreboard/new-game');
    if (EnvironmentDetection.isMobileApp()) {
      AudioSFXProvider.setInterface('CordovaMedia');
    } else {
      AudioSFXProvider.setInterface('HTML5Audio');
    }
  }
]);angular.module('scoreboard.common').constant('AudioSFXEvents', {
  START: 'AudioSFX.pley',
  END: 'AudioSFX.stop'
});angular.module('scoreboard.common').constant('EnvironmentDetection', {
  isMobileApp: function () {
    return !this.isBrowser();
  },
  isBrowser: function () {
    return typeof cordova == 'undefined' || cordova == null;
  }
});angular.module('scoreboard.common').directive('audioSfx', [
  'AudioSFX',
  function (AudioSFX) {
    return {
      restrict: 'E',
      templateUrl: 'templates/directives/audioSfx.html',
      link: function (scope) {
        scope.isPLaying = false;
        scope.$on(AudioSFX.EVENTS.START, function () {
          scope.isPLaying = true;
        });
        scope.$on(AudioSFX.EVENTS.END, function () {
          scope.isPLaying = false;
        });
        scope.cancel = AudioSFX.stop;
      }
    };
  }
]);angular.module('scoreboard.common').directive('countDown', function () {
  return {
    restrict: 'AE',
    scope: {
      from: '=',
      autostart: '='
    },
    transclude: true,
    templateUrl: 'templates/directives/countDown.html',
    controller: [
      '$scope',
      '$interval',
      '$element',
      '$log',
      function ($scope, $interval, $element, $log) {
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        var timer = null;
        $scope.reset = reset;
        reset();
        stop();
        $scope.$watch('from', function (value) {
          console.log('--------------changed ', value);
          if ($scope.autostart === true) {
            reset();
            start();
          }
        });
        function start() {
          if ($scope.remainingTime <= 0) {
            reset();
          }
          var countDown, start = null, countDownInitialValue = $scope.remainingTime;
          function step(timestamp) {
            if (start === null)
              start = timestamp;
            countDown = countDownInitialValue - (timestamp - start) / 100;
            if (countDown > 0) {
              requestAnimationFrame(step);
            }
          }
          requestAnimationFrame(step);
          timer = $interval(function () {
            //countDown is maintained using requestAnimationFrame since it's based on timestamps (more precise than timeout)
            //we use the timeout to display the values, so we keep on going in scope.$apply to update display
            $scope.remainingTime = countDown;
            if ($scope.remainingTime <= 0) {
              end();
            }
          }, 100);
          $element.addClass('running').removeClass('stopped');
          $scope.$emit('countdown.start');
        }
        function stop() {
          $interval.cancel(timer);
          timer = null;
          $element.removeClass('running').addClass('stopped');
        }
        function end() {
          stop();
          $element.removeClass('running stopped').addClass('ended');
          $scope.$emit('countdown.end');
        }
        function reset() {
          $scope.remainingTime = $scope.from * 10;
          $log.log('reset to ', $scope.remainingTime);
          $element.removeClass('ended');
          $scope.$emit('countdown.reset');
        }
        $scope.toggleState = function () {
          if (timer !== null) {
            stop();
          } else {
            start();
          }
        };
      }
    ],
    link: function (scope) {
    }
  };
});angular.module('scoreboard.common').directive('numberToTime', [
  '$filter',
  function ($filter) {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelController) {
        ngModelController.$parsers.push(function (data) {
          //convert data from view format to model format
          var parts = data.split(':'), current, total = 0, count = 0;
          while (parts.length > 0) {
            current = parts.pop();
            total += current * Math.pow(60, count);
            count++;
          }
          return '' + total;  //converted
        });
        ngModelController.$formatters.push(function (data) {
          //convert data from model format to view format
          return $filter('secondsFormat')(data);  //converted
        });
      }
    };
  }
]);angular.module('scoreboard.common').directive('scorePanel', function () {
  return {
    restrict: 'AE',
    scope: {
      teamName: '=',
      score: '='
    },
    templateUrl: 'templates/directives/scorePanel.html',
    controller: [
      '$scope',
      '$interval',
      '$element',
      function ($scope, $interval, $element) {
        $scope.increase = function () {
          $scope.score++;
          $scope.$emit('score.change', $element, $scope.score - 1, $scope.score);
        };
        $scope.decrease = function () {
          if ($scope.score > 0) {
            $scope.score--;
            $scope.$emit('score.change', $element, $scope.score + 1, $scope.score);
          }
        };
      }
    ],
    link: function (scope, element, attrs) {
    }
  };
});angular.module('scoreboard.common').filter('secondsFormat', function () {
  return function (seconds) {
    var hours = Math.floor(seconds / 3600), minutes = Math.floor((seconds - hours * 3600) / 60), seconds = seconds - hours * 3600 - minutes * 60;
    return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
  };
});
angular.module('scoreboard.common').filter('splitSecondsFormat', function () {
  return function (split) {
    var origSplit = split;
    split = parseInt(split);
    var hours = Math.floor(split / 36000), minutes = Math.floor((split - hours * 36000) / 600), seconds = Math.floor((split - hours * 36000 - minutes * 600) / 10), split = Math.floor(split - hours * 36000 - minutes * 600 - seconds * 10);
    if (hours != 0) {
      return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
    } else if (minutes != 0) {
      return ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
    } else {
      return ('0' + seconds).slice(-2) + '.' + split;
    }
  };
});angular.module('scoreboard.common').provider('AudioSFX', [
  'AudioSFXEvents',
  function (AudioSFXEvents) {
    var AudioSFXProvider;
    return AudioSFXProvider = {
      _interfaceName: 'HTML5Audio',
      interface: null,
      setInterface: function (interfaceName) {
        AudioSFXProvider._interfaceName = interfaceName;
      },
      $get: [
        '$rootScope',
        '$injector',
        'EnvironmentDetection',
        function ($rootScope, $injector, EnvironmentDetection) {
          var AudioSFX, player = null, playing = null, prefixPath = '', lastPlayedScore = null, SFX = {
              END_OF_PERIOD: 'end-of-period/end-of-period.mp3',
              SCORE: 'score/Hockey NHL - Home Goal Air Horn.mp3',
              END_OF_GAME: 'end-of-game/end.mp3'
            };
          $injector.invoke([
            AudioSFXProvider._interfaceName,
            function (audioInterface) {
              AudioSFXProvider.interface = audioInterface;
            }
          ]);
          window.EnvironmentDetection = EnvironmentDetection;
          if (EnvironmentDetection.isMobileApp()) {
            prefixPath = '/android_asset/www/';
          }
          //player.style.display("none");
          function play(file, sport) {
            playing = file;
            AudioSFXProvider.interface.play(prefixPath + 'audio/' + sport + '/' + file);
            console.log(prefixPath + 'audio/' + sport + '/' + file);
            $rootScope.$broadcast(AudioSFX.EVENTS.START);
          }
          return AudioSFX = {
            EVENTS: AudioSFXEvents,
            delayForScoreReplay: 90,
            stop: function () {
              AudioSFXProvider.interface.pause();
              $rootScope.$broadcast(AudioSFXEvents.END);
            },
            listenForSFX: function () {
            },
            playRandom: function () {
            },
            endOfPeriod: function (game) {
              play(SFX.END_OF_PERIOD, game.sport);
            },
            endOfGame: function (game) {
              play(SFX.END_OF_GAME, game.sport);
            },
            score: function (game) {
              if (lastPlayedScore == null || playing !== SFX.SCORE || playing === SFX.SCORE && new Date().getTime() > lastPlayedScore.getTime() + AudioSFX.delayForScoreReplay * 1000) {
                lastPlayedScore = new Date();
                play(SFX.SCORE, game.sport);
              }
            }
          };
        }
      ]
    };
  }
]);angular.module('scoreboard.common').factory('CordovaMedia', [
  '$rootScope',
  'AudioSFXEvents',
  function ($rootScope, AudioSFXEvents) {
    var CordovaMedia, media = null, mediaVolume = 1;
    //todo: implement on end
    //   player.onended = function(){
    //      $rootScope.$broadcast(AudioSFXEvents.END);
    //   };
    function onStatusChange(state) {
      switch (state) {
      case Media.MEDIA_STARTING:
        break;
      case Media.MEDIA_RUNNING:
        break;
      case Media.MEDIA_PAUSED:
        break;
      case Media.MEDIA_STOPPED:
        CordovaMedia.stop();
        break;
      case Media.MEDIA_NONE:
      default:
      }
    }
    return CordovaMedia = {
      play: function (src) {
        if (media != null) {
          media.release();
        }
        media = new Media(src, function () {
          console.log('done');
        }, function (e) {
        }, onStatusChange);
        //media.setVolume(mediaVolume);
        media.play();
      },
      pause: function () {
        media.pause();
      },
      stop: function () {
        media.pause();
        media.release();
        $rootScope.$broadcast(AudioSFXEvents.END);
        $rootScope.$apply();
      },
      mute: function () {
        media.setVolume('0.0');
      },
      unMute: function () {
        media.setVolume(mediaVolume);
      },
      setVolume: function (volume) {
        if (volume < 0 || volume > 100) {
          throw 'Volume should be a percentage';
        }
        mediaVolume = (volume / 100).toFixed(1).toString().replace(',', '.');
        media.setVolume(mediaVolume);
      }
    };
  }
]);angular.module('scoreboard.common').factory('HTML5Audio', [
  '$rootScope',
  'AudioSFXEvents',
  function ($rootScope, AudioSFXEvents) {
    var HTML5Audio, player = document.createElement('audio');
    player.onended = function () {
      HTML5Audio.stop();
    };
    return HTML5Audio = {
      play: function (src) {
        player.src = src;
        player.play();
      },
      pause: function () {
        player.pause();
      },
      stop: function () {
        player.pause();
        $rootScope.$broadcast(AudioSFXEvents.END);
        $rootScope.$apply();
      },
      mute: function () {
      },
      setVolume: function (vol) {
        return 'NOT IMPLEMENTED';
      }
    };
  }
]);angular.module('scoreboard.common').factory('BluetoothRemote', [
  '$q',
  '$rootScope',
  '$log',
  function ($q, $rootScope, $log) {
    var BluetoothRemote, errorMessages = {
        BLUETOOTH_NOT_AVAILABLE: 'Device bluetooth is not available',
        FAILED_TO_ENABLE: 'failed to enable bluetooth on device',
        FAILED_TO_CHECK_ENABLED: 'failed to check if bluetooth is enabled on device',
        FAILED_TO_DISCOVER: 'Failed to discover devices',
        FAILED_TO_CHECK_PAIRED: 'Failed to check paired status',
        FAILED_TO_CONNECT: 'Failed to connect',
        NO_UUID_RETRIEVED: 'No uuids found for device'
      },
      //todo use provider to be able to configure this
      compatibleProfiles = [
        '0000110E',
        '0000110f'
      ];
    function isAvailable() {
      return typeof bluetooth !== 'undefined';
    }
    function findCompatibleProfiles(uuids) {
      var matches = [];
      for (var i = 0; i < uuids.length; i++) {
        if (compatibleProfiles.indexOf(uuids[i]) !== -1) {
          matches.push(uuids[i]);
        }
      }
      return matches;
    }
    return BluetoothRemote = {
      events: {
        DATA_RECEIVED: 'BluetoothRemote.data_read',
        DATA_ERROR: 'BluetoothRemote.data_error'
      },
      scanDelay: 30,
      enable: function () {
        var serviceDefer = $q.defer();
        $log.log('init check is available');
        if (isAvailable()) {
          $log.log('bluetooth is available - enable');
          bluetooth.isEnabled(function (isEnabled) {
            $log.log('bluetooth is enabled ? ', isEnabled);
            if (!isEnabled) {
              $log.log('enabling..');
              bluetooth.enable(function () {
                $log.log('enabled!.');
                serviceDefer.resolve(true);
                $rootScope.$apply();
              }, function () {
                $log.log('NOT enabled!.');
                serviceDefer.reject(errorMessages.FAILED_TO_ENABLE);
                $rootScope.$apply();
              });
            } else {
              serviceDefer.resolve(true);
            }
          }, function () {
            serviceDefer.reject(errorMessages.FAILED_TO_CHECK_ENABLED);
            serviceDefer.resolve(true);
            $rootScope, $apply();
          });
        } else {
          serviceDefer.reject(errorMessages.BLUETOOTH_NOT_AVAILABLE);
          return false;
        }
        return serviceDefer.promise;
      },
      scan: function () {
        var serviceDefer = $q.defer();
        if (isAvailable()) {
          $log.log('bluetooth is available - scan');
          BluetoothRemote.enable().then(function () {
            var startScanTime = new Date(), devices = [];
            function onDeviceDiscovered(device) {
              devices.push(device);
              $log.log('found', device);
              $rootScope.$apply();
            }
            function onDiscoveryFinished() {
              $log.log('finished');
              serviceDefer.resolve(devices);
              $rootScope.$apply();
            }
            function onError() {
              serviceDefer.reject(errorMessages.FAILED_TO_DISCOVER);
              $rootScope.$apply();
            }
            $log.log('start discovery');
            bluetooth.startDiscovery(onDeviceDiscovered, onDiscoveryFinished, onError);
            return true;
          });
        } else {
          serviceDefer.reject(errorMessages.BLUETOOTH_NOT_AVAILABLE);
          return false;
        }
        return serviceDefer.promise;
      },
      pair: function (deviceAddress) {
        var serviceDefer = $q.defer();
        if (isAvailable()) {
          function onSuccess(isPaired) {
            if (!isPaired) {
              bluetooth.pair(function (isPaired) {
                serviceDefer.resolve(true);
                $log.log('paired', isPaired);
              }, function (error) {
                serviceDefer.reject(error);
              }, deviceAddress);
            } else {
              $log.log('already paired');
              serviceDefer.resolve(true);
            }
          }
          function onError() {
            serviceDefer.reject(errorMessages.FAILED_TO_CHECK_PAIRED);
          }
          bluetooth.isPaired(onSuccess, onError, deviceAddress);
        } else {
          serviceDefer.reject(errorMessages.BLUETOOTH_NOT_AVAILABLE);
          return false;
        }
        return serviceDefer.promise;
      },
      connect: function (deviceAddress, uuid) {
        var serviceDefer = $q.defer();
        function connect(deviceAddress, uuid) {
          bluetooth.connect(function (isConnected) {
            $log.log('Connected', isConnected);
            if (isConnected) {
              serviceDefer.resolve(true);
            } else {
              serviceDefer.reject(errorMessages.FAILED_TO_CONNECT);
            }
            $rootScope.$apply();
          }, function (error) {
            $log.log('FAILED TO CONNECT', error);
            serviceDefer.reject(error);
            $rootScope.$apply();
          }, {
            address: deviceAddress,
            uuid: uuid,
            conn: 'Hax'
          });
        }
        if (isAvailable()) {
          BluetoothRemote.pair(deviceAddress).then(function () {
            if (angular.isUndefined(uuid)) {
              bluetooth.getUuids(function (device) {
                $log.log('uuids', device.uuids);
                if (device.uuids.length > 0) {
                  $log.log('CONNECTING TO ', deviceAddress, 'USING', device.uuids[0]);
                  var usableUuids = findCompatibleProfiles(device.uuids);
                  if (usableUuids.length !== 0) {
                    connect(deviceAddress, usableUuids[0]);
                  } else {
                    alert('Cannot use this devices (Must have a compatible profile to use as remote control');
                  }
                } else {
                  $log.log('NO UUID FOUND !');
                  serviceDefer.reject(errorMessages.NO_UUID_RETRIEVED);
                }
              }, function (error) {
                $log.log('CANNOT GET UUIDS', error);
                serviceDefer.reject(error);
              }, deviceAddress);
            } else {
              connect(deviceAddress, uuid);
            }
          });
        } else {
          serviceDefer.reject(errorMessages.BLUETOOTH_NOT_AVAILABLE);
          return false;
        }
        return serviceDefer.promise;
      },
      use: function (deviceAddress) {
        var serviceDefer = $q.defer();
        if (isAvailable()) {
          BluetoothRemote.connect(deviceAddress).then(function () {
            bluetooth.startConnectionManager(function (data) {
              $rootScope.$broadcast(BluetoothRemote.events.DATA_RECEIVED, data);
              $rootScope.$apply();
            }, function (error) {
              $rootScope.$broadcast(BluetoothRemote.events.DATA_ERROR, error);
              $rootScope.$apply();
            });
          });
          serviceDefer.resolve(true);
        } else {
          serviceDefer.reject(errorMessages.BLUETOOTH_NOT_AVAILABLE);
        }
        return serviceDefer.promise;
      },
      getPairedDevices: function () {
        var serviceDefer = $q.defer();
        if (isAvailable()) {
          bluetooth.getPaired(function (devices) {
            serviceDefer.resolve(devices);
            $rootScope.$apply();
          }, function (error) {
            serviceDefer.reject(error);
            $rootScope.$apply();
          });
        } else {
          serviceDefer.reject(errorMessages.BLUETOOTH_NOT_AVAILABLE);
        }
        return serviceDefer.promise;
      }
    };
  }
]);angular.module('scoreboard').factory('Sports', function () {
  return {
    hockey: {
      STATES: {
        PERIOD: 'PERIOD',
        INTERVAL: 'INTERVAL',
        END: 'ENDED'
      },
      getGameParameters: function () {
        return {
          sport: 'hockey',
          periods: {
            quantity: 3,
            length: 60 * 20,
            interval: 60 * 5
          },
          continuousCountdown: true,
          teams: [
            {
              name: 'Home',
              color: '#ffffff',
              score: 0
            },
            {
              name: 'Away',
              color: '#ffffff',
              score: 0
            }
          ]
        };
      }
    }
  };
});/**
 * Connects to whatever methods implemented to log game data.
 */
angular.module('scoreboard.api').provider('API', function () {
  var APIProvider;
  return APIProvider = {
    connector: 'OfflineConnector',
    $get: [
      'KeepIt',
      '$injector',
      function (KeepIt, $injector) {
        var connectorService, API;
        function loadConnector() {
          $injector.invoke([
            APIProvider.connector,
            function (connector) {
              connectorService = connector;
            }
          ]);
        }
        loadConnector();
        return API = {
          createGame: function (gameParams) {
            gameParams.gameId = 'game_' + new Date().getTime();
            //moment().format('YYYY-MM-DD-HH-mm-ss');
            gameParams.createdAt = new Date();
            var gameId = connectorService.createGame(gameParams);
            return gameId;
          },
          getGame: function (gameId) {
            return connectorService.getGame(gameId);
          },
          updateScore: function (scoreObject) {
            return true;
          },
          endGame: function (gameId) {
            return true;
          },
          changeConnector: function (newConnector) {
            APIProvider.connector = newConnector;
            loadConnector();
          },
          listGames: function () {
            return connectorService.listGames();
          }
        };
      }
    ]
  };
});/**
 * Handle game data locally. No data sent to external services whatsoever
 */
angular.module('scoreboard.api').factory('OfflineConnector', [
  'KeepIt',
  function (KeepIt) {
    var OfflineConnector, gameDataStorage = KeepIt.getModule('OfflineConnector', KeepIt.types.PERSISTENT);
    return OfflineConnector = {
      createGame: function (gameParams) {
        gameDataStorage.put(gameParams.gameId, gameParams);
        return gameParams.gameId;
      },
      getGame: function (gameId) {
        return gameDataStorage.getValue(gameId);
      },
      listGames: function () {
        window.gameDataStorage = gameDataStorage;
        var list = [], keys = gameDataStorage.getAllKeys();
        angular.forEach(keys, function (v, key) {
          list.push(gameDataStorage.getValue(key));
        });
        return list;
      }
    };
  }
]);angular.module('scoreboard').controller('BoardCtrl', [
  '$log',
  '$stateParams',
  'AudioSFX',
  '$state',
  '$scope',
  'API',
  'EnvironmentDetection',
  'Sports',
  function ($log, $stateParams, AudioSFX, $state, $scope, API, EnvironmentDetection, Sports) {
    function bindSoundEvents() {
      $scope.$on('score.change', function (event, element, previousScore, score) {
        if (previousScore < score) {
          AudioSFX.score($scope.game);
        }
      });
      $scope.$on('countdown.end', function (event, element, score) {
        AudioSFX.endOfPeriod($scope.game);
      });
    }
    function keepAwake() {
      if (EnvironmentDetection.isMobileApp()) {
        window.plugins.insomnia.keepAwake(function () {
        }, function () {
          alert('Something went wrong while trying to disable sleep mode.');
        });
      }
      $scope.$on('$destroy', function () {
        AudioSFX.stop();
        if (EnvironmentDetection.isMobileApp()) {
          window.plugins.insomnia.allowSleepAgain(function () {
          }, function () {
            alert('Something went wrong while trying to re-enable sleep mode.');
          });
        }
      });
    }
    function nextState(currentState, currentPeriod) {
      $log.log('period is ', currentPeriod, currentState);
      if (currentState === Sports[game.sport].STATES.PERIOD) {
        if (currentPeriod == game.periods.quantity) {
          return Sports[game.sport].STATES.END;
        } else {
          return Sports[game.sport].STATES.INTERVAL;
        }
      } else if (currentState === Sports[game.sport].STATES.INTERVAL) {
        return Sports[game.sport].STATES.PERIOD;
      } else if (currentState === Sports[game.sport].STATES.END) {
      }
    }
    function handlePeriodChange() {
      $scope.$on('countdown.end', function (event, element, score) {
        $scope.countdownAutostart = false;
        $scope.state = nextState($scope.state, $scope.currentPeriod);
        switch ($scope.state) {
        case Sports[game.sport].STATES.PERIOD:
          $scope.currentPeriod++;
          $scope.countdownValue = game.periods.length;
          break;
        case Sports[game.sport].STATES.INTERVAL:
          $scope.countdownValue = game.periods.interval;
          break;
        case Sports[game.sport].STATES.END:
          $scope.hideCountdown = true;
          AudioSFX.endOfGame(game);
          break;
        }
        $scope.countdownAutostart = game.continuousCountdown;
      });
    }
    keepAwake();
    bindSoundEvents();
    handlePeriodChange();
    var game = $scope.game = API.getGame($stateParams.gameId);
    $scope.currentPeriod = 1;
    $scope.state = Sports[game.sport].STATES.PERIOD, $scope.countdownValue = game.periods.length;
    $scope.countdownAutostart = false;
    $scope.backToList = function () {
      $state.go('scoreboard.list');
    };
  }
]);angular.module('scoreboard').controller('BoardListCtrl', [
  '$log',
  '$stateParams',
  '$state',
  '$scope',
  'API',
  'Sports',
  function ($log, $stateParams, $state, $scope, API, Sports) {
    $scope.games = API.listGames();
    $log.log($scope.games);
  }
]);angular.module('scoreboard').controller('NewGameCtrl', [
  '$log',
  '$state',
  '$scope',
  'API',
  'Sports',
  function ($log, $state, $scope, API, Sports) {
    $scope.gameParams = Sports.hockey.getGameParameters();
    $scope.increaseStep = function (prop, increment) {
      var closestStep = Math.floor(prop / increment);
      return increment * closestStep + increment;
    };
    $scope.decreaseStep = function (prop, increment) {
      var closestStep = Math.floor((prop - 1 + increment) / increment);
      return Math.max(1, increment * closestStep - increment);
    };
    $scope.createGame = function () {
      var gameId = API.createGame($scope.gameParams);
      $state.go('scoreboard.board', { gameId: gameId });
    };
  }
]);angular.module('scoreboard').controller('SettingsRemoteCtrl', [
  '$log',
  '$stateParams',
  '$state',
  '$scope',
  '$ionicNavBarDelegate',
  'BluetoothRemote',
  'API',
  'Sports',
  function ($log, $stateParams, $state, $scope, $ionicNavBarDelegate, BluetoothRemote, API, Sports) {
    $scope.devices = [];
    $scope.scannedDevices = [];
    $scope.getPreviousTitle = function () {
      debugger;
      $ionicNavBarDelegate.getPreviousTitle();
    };
    $scope.$on(BluetoothRemote.events.DATA_RECEIVED, function (data) {
      $log.log(data);
    });
    $scope.$on(BluetoothRemote.events.DATA_ERROR, function (error) {
      $log.error('error reading bluetooth', error);
    });
    BluetoothRemote.getPairedDevices().then(function (devices) {
      $scope.devices = devices;
    });
    $scope.scanBluetooth = function () {
      $log.log('scanning...');
      BluetoothRemote.scan().then(function (devices) {
        $log.log('got devices !', devices);
        $scope.scannedDevices = devices;
      }, function (error) {
        $log.log(error);
      });
    };
    $scope.selectDevice = function (device) {
      BluetoothRemote.use(device.address).catch(function (error) {
        $log.error(error);
      });
      $log.log('seleced', device.address);
    };
  }
]);angular.module('scoreboard').controller('SettingsSessionCtrl', [
  '$log',
  '$stateParams',
  '$state',
  '$scope',
  '$ionicNavBarDelegate',
  'API',
  'Sports',
  function ($log, $stateParams, $state, $scope, $ionicNavBarDelegate, API, Sports) {
    $scope.getPreviousTitle = function () {
      debugger;
      $ionicNavBarDelegate.getPreviousTitle();
    };
  }
]);angular.module('scoreboard').controller('TabsCtrl', [
  '$scope',
  '$element',
  '$state',
  '$timeout',
  function ($scope, $element, $state, $timeout) {
    var tabs;
    $timeout(function () {
      tabs = angular.element($element[0].querySelector('.tabs'));
    }, 0);
    $scope.$on('$stateChangeSuccess', function () {
      $timeout(function () {
        if ($state.current.autoHideTabs) {
          tabs.addClass('hide');
          console.log('HIDDE');
        } else {
          tabs.removeClass('hide');
        }
      }, 0);
    });
  }
]);