'use strict';
angular.module('app').directive('appPositionList', ['$http', function($http){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/positionList.html',
    scope: {
      data: '=',
      filterObj: '='
    }
  };
}]);
