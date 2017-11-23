var app = angular.module('usuario');
app.controller('chatController', ['$scope','sharedProperties', function($scope,$routeParams) {

    $scope.inicializa = function() {

        console.log("Parâmetros:" + JSON.stringify($routeParams));


    }


}]);

