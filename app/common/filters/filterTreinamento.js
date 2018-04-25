(function () {
    'use strict';

    angular.module('app.filtersT', [])
        .filter('filterTreinamento', filterTreinamento);

    filterTreinamento.$inject = [];

    function filterTreinamento(){

        return function( items, treinado ) {

            var filtered = [];
            var condicao =  treinado == 'Sim' ? true  : false;

            if(!treinado){//se treinado is undifenid
                angular.forEach(items, function(item) {
                    filtered.push(item);
                });
                return filtered;
            }
            angular.forEach(items, function(item) {
                if( condicao == item.treinado ) {
                    filtered.push(item);
                }
            });
            return filtered;
        };
    }
})();
