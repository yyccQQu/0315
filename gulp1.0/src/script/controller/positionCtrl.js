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
