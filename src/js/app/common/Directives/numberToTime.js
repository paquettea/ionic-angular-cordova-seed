angular.module("scoreboard.common").directive("numberToTime",function ($filter){
   return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelController) {
         ngModelController.$parsers.push(function(data) {
            //convert data from view format to model format
            var parts = data.split(":"),
                current,
                total = 0,
                count = 0;
            while( parts.length > 0){
               current = parts.pop();
               total += current * Math.pow(60,count);
               count++;
            }
            return "" + total; //converted
         });

         ngModelController.$formatters.push(function(data) {
            //convert data from model format to view format
            return $filter("secondsFormat")(data); //converted
         });
      }
   }
});

