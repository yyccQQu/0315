'use strict'

angular.module('app',['ui.router', 'ngCookies', 'validation', 'ngAnimate']);

'use strict'

angular.module('app').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('main', {
    url: '/main',
    templateUrl: 'view/main.html',
    controller: 'mainCtrl'
  }).state('position',{
    url: '/position/:id',
    templateUrl: "view/position.html",
    controller: 'positionCtrl'
  })

  $urlRouterProvider.otherwise('main');
}])

'use strict'
angular.module('app').controller('mainCtrl',['$http','$scope', function($http,$scope){
  $http.get('/data/positionList.json').success(function(resp){
    $scope.list = resp
    console.log(resp)
  }).error(function(err){
    console.log(err)
  });

}])

'use strict'

angular.module('app').controller('positionCtrl',['$log','$q','$http','$state','$scope', function($log,$q,$http,$state,$scope){

  $scope.message = $scope.isLogin?'投个简历':'去登陆';

  $log.log('第二个页面')

  function getPosition() {
    var def = $q.defer();//异步执行方法
    $http.get('data/position.json', {
      params: {
        id: $state.params.id
      }
    }).success(function(resp) {
      $scope.position = resp;
      if(resp.posted) {
        $scope.message = '已投递';
      }
      def.resolve(resp);//执行成功返回data数据
    }).error(function(err){
      def.eject(err);//失败返回错误信息
    });
    return def.promise;//将promise对象返回回去
  }
  function getCompany(id) {
    $http.get('data/company.json?id='+id).success(function(resp){
      $scope.company = resp;
    })
  }
  getPosition().then(function(obj){
    getCompany(obj.companyId);
  });
  $scope.go = function() {
    if($scope.message !== '已投递') {
      if($scope.isLogin) {
        $http.post('data/handle.json', {
          id: $scope.position.id
        }).success(function(resp) {
          $log.info(resp);
          $scope.message = '已投递';
        });
      } else {
        $state.go('login');
      }
    }
  }



}])

'use strict';
angular.module('app').directive('appCompany', [function(){
  return {
    restrict: 'A',
    replace: true,
    scope: {
      com: '='
    },
    templateUrl: 'view/template/company.html'
  };
}]);

'use strict';
angular.module('app').directive('appFoot', [function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/foot.html'
  }
}])

'use strict'
angular.module('app').directive('appHead', [function(){
  return{
    restrict: "A",
    replace: true,
    templateUrl: 'view/template/head.html'
  }
}])

angular.module('app').directive('appHeadBar',[function() {

  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/headBar.html',
    scope: {
      text: '@'
    },
    link: function($scope){
      $scope.back = function() {
        window.history.back();
      };
    }
  };

}])

angular.module('app').directive('appPositionInfo',['$http',function($http) {
  return {
    restrict: 'A',
    replace: true,
    templageUrl: 'view/template/positionInfo.html',
    scope: {
      isActive: '=',
      isLogin: '=',
      pos: '='
    },
    link: function($scope) {
      $scope.$watch('pos', function(newVal) {
        if(newVal) {
          $scope.pos.select = $scope.pos.select || false;
          $scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
        }
      })
      $scope.favorite = function() {
        $http.post('data/favorite.json', {
          id: $scope.pos.id,
          select: !$scope.pos.select
        }).success(function(resp) {
          $scope.pos.select = !$scope.pos.select;
          $scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
        });
      }
    }
  }
}])

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
