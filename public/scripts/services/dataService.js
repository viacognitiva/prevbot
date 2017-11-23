angular.module('usuario',[])
    .service('sharedProperties', function(){

        var dados;

        var addValor = function(valor){
            dados = valor;
        };

        var getValor = function(){
            return dados;
        };

        return{
            addValor: addValor,
            getValor: getValor
        };

    }
)
