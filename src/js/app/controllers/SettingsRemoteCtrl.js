angular.module("scoreboard").controller('SettingsRemoteCtrl',
    function(
        $log,
        $stateParams,
        $state,
        $scope,
        $ionicNavBarDelegate,
        BluetoothRemote,
        API,
        Sports){


        $scope.devices = [];
        $scope.scannedDevices = [];

        $scope.getPreviousTitle =function(){
            debugger;
            $ionicNavBarDelegate.getPreviousTitle();
        }

        $scope.$on(BluetoothRemote.events.DATA_RECEIVED,function(data){
            $log.log(data);
        });
        $scope.$on(BluetoothRemote.events.DATA_ERROR,function(error){
            $log.error("error reading bluetooth",error);
        });

        BluetoothRemote.getPairedDevices().then(function(devices){
           $scope.devices = devices;
        });

        $scope.checkManaged = function(){
            BluetoothRemote.isConnectionManaged($scope.deviceAddress).then(function(isManaged){
                $log.log("MANAGED ?",isManaged);
            },function (error){
                $log.log("error ?",error);
            });
        };
        $scope.scanBluetooth = function(){
            $log.log("scanning...");
            BluetoothRemote.scan().then(function(devices){

                $log.log("got devices !", devices);
                $scope.scannedDevices = devices;
            },function(error){
                $log.log(error);
            })
        }

        $scope.selectDevice = function(device){
            $scope.deviceAddress = device.address;
            BluetoothRemote.use(device.address).catch(function(error){
                $log.error(error);
            });


            $log.log("seleced", device.address);
        }
    });
