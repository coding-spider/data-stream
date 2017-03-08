'use strict';

/**
 * @ngdoc function
 * @name app.controller:AppCtrl
 * @description
 * # MainCtrl
 * Controller of the app
 */
angular.module('app')
    .controller('AppCtrl', ['$scope', '$window', '$rootScope',
        function($scope, $window, $rootScope) {

            $scope.app = {
                name: 'Mean',
                version: '1.0.0',
            }
            $scope.goBack = function() {
                $window.history.back();
            }
        }
    ]);
