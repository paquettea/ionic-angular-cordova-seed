angular.module("scoreboard").controller('BoardCtrl',
    function ($log, $stateParams, AudioSFX, $state, $scope, API, EnvironmentDetection, Sports) {


        function bindSoundEvents() {
            $scope.$on("score.change", function (event, element, previousScore, score) {
                if (previousScore < score) {
                    AudioSFX.score($scope.game);
                }
            });

            $scope.$on("countdown.start", function (event) {
                debugger;
                if ($scope.state === Sports[$scope.game.sport].STATES.PERIOD &&  $scope.currentPeriod === 1) {
                    console.log("Start of game sound");
                    AudioSFX.startOfGame($scope.game);
                }else if($scope.state === Sports[$scope.game.sport].STATES.PERIOD){
                    console.log("Start of PERIOD sound");
                    AudioSFX.startOfPeriod($scope.game);
                }
            });
            $scope.$on("countdown.end", function (event, element, score) {
                if ($scope.game.currentPeriod === $scope.game.periods.quantity){
                    AudioSFX.endOfGame($scope.game);
                }else{
                    AudioSFX.endOfPeriod($scope.game);
                }

            });
            $scope.$on("countdown.end", function (event, element, score) {
                AudioSFX.endOfPeriod($scope.game);
            });
        }

        function keepAwake() {
            if (EnvironmentDetection.isMobileApp()) {
                window.plugins.insomnia.keepAwake(function () {
                }, function () {
                    alert('Something went wrong while trying to disable sleep mode.')
                })
            }
            $scope.$on("$destroy", function () {
                AudioSFX.stop();
                if (EnvironmentDetection.isMobileApp()) {
                    window.plugins.insomnia.allowSleepAgain(function () {
                    }, function () {
                        alert('Something went wrong while trying to re-enable sleep mode.')
                    })
                }
            });
        }

        function nextState(currentState, currentPeriod) {
            $log.log("period is ", currentPeriod, currentState);
            if (currentState === Sports[game.sport].STATES.PERIOD) {
                if (currentPeriod == game.periods.quantity) {
                    return Sports[game.sport].STATES.END;
                } else {
                    return  Sports[game.sport].STATES.INTERVAL;

                }

            } else if (currentState === Sports[game.sport].STATES.INTERVAL) {

                return  Sports[game.sport].STATES.PERIOD;
            } else if (currentState === Sports[game.sport].STATES.END) {
                //there should not be a state after the game is ended
            }
        }

        function handlePeriodChange() {

            $scope.$on("countdown.end", function (event, element, score) {
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
        $scope.state = Sports[game.sport].STATES.PERIOD,

            $scope.countdownValue = game.periods.length;
        $scope.countdownAutostart = false;

        $scope.backToList = function () {
            $state.go("scoreboard.list");
        }
    });