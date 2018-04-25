(function () {
    'use strict';

    angular.module('app.filtersC', [])
        .filter('filterConfianca', filterConfianca);

    filterConfianca.$inject = [];

    function filterConfianca(){

        return function(items,sinal,porcentagem,tpTreinamento) {

            var filtered = [];

            if(!sinal || !porcentagem || !tpTreinamento ){
                angular.forEach(items, function(item) {
                    filtered.push(item);
                });
                return filtered;
            }

            if(tpTreinamento=='Entidade') {
                if(sinal=='<='){
                    angular.forEach(items, function(item) {
                        if( item.confidenceEntidade <= porcentagem  ) {
                            filtered.push(item);
                        }
                    });
                    return filtered;
                } else if (sinal=='>='){
                    angular.forEach(items, function(item) {
                        if(item.confidenceEntidade >= porcentagem ) {
                            filtered.push(item);
                        }
                    });
                    return filtered;
                }

            } else if(tpTreinamento =='Intenção'){

                if(sinal=='<='){
                    angular.forEach(items, function(item) {
                        if( item.confidenceIntencao <= porcentagem  ) {
                            filtered.push(item);
                        }
                    });
                    return filtered;

                } else if (sinal=='>='){
                    angular.forEach(items, function(item) {
                        if(item.confidenceIntencao >= porcentagem ) {
                            filtered.push(item);
                        }
                    });
                    return filtered;
                }
            }
        };
    }
})();