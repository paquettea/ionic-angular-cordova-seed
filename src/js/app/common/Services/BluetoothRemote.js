angular.module("scoreboard.common").factory("BluetoothRemote",
    function(
        $q,
        $rootScope,
        $log){

        var BluetoothRemote,
            errorMessages = {
                BLUETOOTH_NOT_AVAILABLE : "Device bluetooth is not available",
                FAILED_TO_ENABLE : "failed to enable bluetooth on device",
                FAILED_TO_CHECK_ENABLED : "failed to check if bluetooth is enabled on device",
                FAILED_TO_DISCOVER : "Failed to discover devices",
                FAILED_TO_CHECK_PAIRED : "Failed to check paired status",
                FAILED_TO_CONNECT :  "Failed to connect",
                NO_UUID_RETRIEVED : "No uuids found for device"
            },

            //todo use provider to be able to configure this
            compatibleProfiles = [
                "0000110E", //RemoteControl
                "0000110f", //RemoteControlController
                "00001101",//serial rfcomm
                "00001124" //PS3 BD Remote HID
            ];



        function isAvailable(){

            return typeof bluetooth !== "undefined";

        }

        function findCompatibleProfiles (uuids){
            var matches = [];
            for (var i = 0 ; i < uuids.length ; i++){
                if (compatibleProfiles.indexOf(uuids[i].split('-')[0]) !== -1){
                    matches.push(uuids[i])
                }
            }
            return uuids;
        }
        return BluetoothRemote = {
            events : {
                DATA_RECEIVED:"BluetoothRemote.data_read",
                DATA_ERROR : "BluetoothRemote.data_error"
            },
            scanDelay: 30 , //number of seconds to scan when discovering
            enable :function(){
                var serviceDefer = $q.defer();

                $log.log("init check is available");
                if (isAvailable()){
                    $log.log("bluetooth is available - enable");
                    bluetooth.isEnabled(function(isEnabled){
                        $log.log("bluetooth is enabled ? ", isEnabled);
                        if (!isEnabled){
                            $log.log("enabling..");
                            bluetooth.enable(function(){
                                $log.log("enabled!.");
                                serviceDefer.resolve(true);
                                $rootScope.$apply();
                            }, function(){
                                $log.log("NOT enabled!.");
                                serviceDefer.reject(errorMessages.FAILED_TO_ENABLE)
                                $rootScope.$apply();
                            });
                        }else{
                            serviceDefer.resolve(true);
                        }
                    }, function(){
                        serviceDefer.reject(errorMessages.FAILED_TO_CHECK_ENABLED)
                        serviceDefer.resolve(true);
                        $rootScope,$apply();
                    })
                }else{
                    serviceDefer.reject(errorMessages.BLUETOOTH_NOT_AVAILABLE);
                    return false;
                }

                return serviceDefer.promise;
            },

            scan:function(){
                var serviceDefer = $q.defer();

                if (isAvailable()){
                    $log.log("bluetooth is available - scan");
                    BluetoothRemote.enable().then(function(){
                        var startScanTime = new Date(),
                            devices = [];

                        function onDeviceDiscovered(device){
                            devices.push (device);
                            $log.log("found", device);
                            $rootScope.$apply();
                        }
                        function onDiscoveryFinished(){
                            $log.log("finished");
                            serviceDefer.resolve(devices);
                            $rootScope.$apply();
                        }
                        function onError(){
                            serviceDefer.reject(errorMessages.FAILED_TO_DISCOVER)
                            $rootScope.$apply();
                        }

                        $log.log("start discovery");
                        bluetooth.startDiscovery(onDeviceDiscovered,onDiscoveryFinished,onError);

                        return true;
                    });

                }else{
                    serviceDefer.reject(errorMessages.BLUETOOTH_NOT_AVAILABLE);
                    return false;
                }

                return serviceDefer.promise;
           },
           pair : function(deviceAddress){
               var serviceDefer = $q.defer();

               if (isAvailable()){
                   function onSuccess(isPaired){
                       if (!isPaired){
                           bluetooth.pair(function(isPaired){
                               serviceDefer.resolve(true);
                               $log.log("paired", isPaired)
                           },function (error){
                               serviceDefer.reject(error);
                           },
                           deviceAddress);
                       }else{
                           $log.log("already paired");
                           serviceDefer.resolve(true);
                       }
                   }
                   function onError(){
                       serviceDefer.reject(errorMessages.FAILED_TO_CHECK_PAIRED);
                   }

                   bluetooth.isPaired(onSuccess,onError,deviceAddress);
               }else{
                   serviceDefer.reject(errorMessages.BLUETOOTH_NOT_AVAILABLE);
                   return false;
               }
               return serviceDefer.promise
           },
           connect : function (deviceAddress,uuid){
               var serviceDefer = $q.defer();

               function connect(deviceAddress,uuid){
                   bluetooth.connect(function (isConnected){
                       $log.log("Connected", isConnected)
                       if (isConnected){
                           serviceDefer.resolve(true);
                       }else{
                           serviceDefer.reject(errorMessages.FAILED_TO_CONNECT);
                       }
                       $rootScope.$apply();
                   },function (error){
                       $log.log("FAILED TO CONNECT", error);
                       serviceDefer.reject(error);
                       $rootScope.$apply();
                   },{
                       address : deviceAddress,
                       uuid:uuid,
                       conn:'Secure' //Insecure, Hax
                   });
               }

               if (isAvailable()){
                  //todo should get uuids before and have a list of devices with grayed items when not matching the compatible profiles
                  BluetoothRemote.pair(deviceAddress).then(function(){

                    if (angular.isUndefined(uuid)){
                        bluetooth.getUuids(function(device){
                            $log.log("uuids",device.uuids);
                            if (device.uuids.length > 0){
                                $log.log("CONNECTING TO ",deviceAddress,"USING",device.uuids[0]);
                                var usableUuids = findCompatibleProfiles(device.uuids);
                                if (usableUuids.length !== 0){
                                    connect(deviceAddress,usableUuids[0]);
                                }else{
                                    alert("Cannot use this devices (Must have a compatible profile to use as remote control");
                                }

                            }else{
                                $log.log("NO UUID FOUND !")
                                serviceDefer.reject(errorMessages.NO_UUID_RETRIEVED)
                            }
                        },function(error){
                            $log.log("CANNOT GET UUIDS",error);
                            serviceDefer.reject(error);
                        },deviceAddress);
                    }else{
                        connect(deviceAddress,uuid);
                    }


                  })
               }else{
                  serviceDefer.reject(errorMessages.BLUETOOTH_NOT_AVAILABLE);
                  return false;
               }
               return serviceDefer.promise
           },
           isConnectionManaged : function (deviceAddress){
               var serviceDefer = $q.defer();

               if (isAvailable()){
                   bluetooth.isConnectionManaged(function(state){
                       serviceDefer.resolve(state)
                   },function(error){
                       serviceDefer.reject(error);
                   });
                }
               return serviceDefer.promise;
           },
           use : function (deviceAddress){
               var serviceDefer = $q.defer();

               if (isAvailable()){
                   BluetoothRemote.connect(deviceAddress).then(function(){
                       bluetooth.startConnectionManager(function(data){
                               $log.log("data !", data);
                          $rootScope.$broadcast(BluetoothRemote.events.DATA_RECEIVED,data);
                          $rootScope.$apply();
                       },
                       function(error){
                           $rootScope.$broadcast(BluetoothRemote.events.DATA_ERROR,error);
                           $rootScope.$apply();
                       });
                   })
                   serviceDefer.resolve(true);
               }else{
                   serviceDefer.reject(errorMessages.BLUETOOTH_NOT_AVAILABLE)
               }

               return serviceDefer.promise;
           },
           getPairedDevices : function(){
               var serviceDefer = $q.defer();

               if (isAvailable()){
                   bluetooth.getPaired(function(devices){
                       serviceDefer.resolve(devices);
                       $rootScope.$apply();
                   },function (error){
                       serviceDefer.reject(error);
                       $rootScope.$apply();
                   });
               }else{
                   serviceDefer.reject(errorMessages.BLUETOOTH_NOT_AVAILABLE);
               }
               return serviceDefer.promise;
           }
       }
});