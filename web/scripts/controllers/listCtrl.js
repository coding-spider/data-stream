app.controller('listCtrl', [
  '$window',
  '$interval',
  '$http',
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  'MODULE_CONFIG',
  function($window, $interval, $http, $scope, $rootScope, $state, $stateParams, MODULE_CONFIG) {

    $scope.all = true;
    $scope.current = {};

    function loadInstruments() {
      $http.get('/api/instruments').then(function(response) {
        if (response.data) {
          $scope.instruments = response.data;
        }
      }, function(err) {
        console.log(err);
      })
    }

    loadInstruments();

    $scope.getId = function(id) {
      $http.get('/api/instruments/' + id).then(function(response) {
        if (response) {
          if (response.data.data) {
            $scope.current = response.data.data;
          } else {
            $scope.current.equipmentId = id;
            $scope.current.position = 'Not Found';
          }
        } else {
          console.log('some Error Occured')
        }
      }, function(err) {
        console.log(err);
      })
    }

    $scope.toggle = function() {
      $scope.all = !$scope.all
    }

  }
]);
