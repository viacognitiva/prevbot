var app = angular.module('MinhaApp', []);

app.controller('myController', function($scope, $http) {
      $scope.respostas=[];
      $scope.outputTabela=[];
      $scope.outputDiv=[];
      $scope.outputEntidade=[];
      $scope.outputConceito=[];

      $scope.buscar = function() {

            if(angular.isUndefined($scope.url) && angular.isUndefined($scope.texto)  ){
                $scope.requiredURL = true;
                $scope.requiredTexto = true;
                return;
            }else {
               $scope.requiredURL = false;
                $scope.requiredTexto = false;
            }

            $http.get('/api/nlu/'+$scope.texto+'/'+$scope.url).success(function(data) {

               var retorno = [];
               var retornoEntidade = [];
               var retornoConceito = [];
                console.log('$scope.passages'+data);

                  angular.forEach(data.keywords, function(item){
                          console.log('keywords '+item.text);
                          console.log('relevante '+item.relevance);
                          console.log('emotional '+item.emotion);
                          console.log('entities '+data.language);
                          retorno.push({language: data.language,palavrachave:item.text,relevancia:(item.relevance*100).toFixed(2)});
                  });

                   angular.forEach(data.entities, function(item){
                          console.log('keywords '+item.text);
                          retornoEntidade.push({nome: item.text,tipo:item.type,relevancia:(item.relevance*100).toFixed(2)});
                                            // retorno.push({texto: item.passage_text, file:item1.extracted_metadata.filename});
                  });

                   angular.forEach(data.concepts, function(item){
                       console.log('keywords '+item.text);
                       retornoConceito.push({nome: item.text,relevancia:(item.relevance*100).toFixed(2)});
                   });

                if(retorno.length==0 && retornoEntidade==0 && retornoConceito==0 ){
                  $scope.errorMessage='Registro não encontrado.';
                } else {
                   $scope.errorMessage='';
                }

                 $scope.outputDiv = retorno;
                 $scope.outputEntidade=retornoEntidade;
                 $scope.outputConceito=retornoConceito;


             });
      }
      $scope.parJson = function (json) {
         return angular.fromJson(json);
      }

      notIsEmpty = function (data) {
              return JSON.stringify(data, function(key, value) { return value === "" ? false : true });

      }

       $scope.reset = function(){
                 // $scope.successMessage='';
                  $scope.errorMessage='';
                  $scope.outputTabela=[];
                  $scope.outputDiv=[];
                  $scope.outputEntidade=[];
                  $scope.myForm.$setPristine(); //reset Form
                  $scope.texto='';
                  $scope.url='';
       };

       $scope.checkTrecho = function () {
           if ($scope.hasTrecho) {
                console.log("CheckBox is checked.");
           } else {
               console.log("CheckBox is not checked.");
           }
        };

});