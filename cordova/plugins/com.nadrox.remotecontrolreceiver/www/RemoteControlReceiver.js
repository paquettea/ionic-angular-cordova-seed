module.export = {
    register: function(success,failure){
        cordova.exec(success, failure, "RemoteControlReceiver", "register");
    },
    unregister: function(success,failure){
        cordova.exec(success, failure, "RemoteControlReceiver", "unregister");
    }
};