var app = angular.module('MinhaApp', []);




app.controller('myController', function($scope, $http) {
      $scope.respostas=[];
      $scope.outputTabela=[];
      $scope.outputDiv=[];
      $scope.buscar = function() {
     // $scope.passages=false;

            $http.get('/api/discovery/'+$scope.texto+'/'+$scope.hasTrecho).success(function(data) {

               var retorno = [];
                console.log('$scope.passages'+$scope.hasTrecho);
               if($scope.hasTrecho){

                  angular.forEach(data.passages, function(item){
                        console.log('passage '+item.passage_text);
                        console.log('id '+item.document_id);
                       // retorno.push({texto: item.passage_text});

                        angular.forEach(data.results, function(item1){
                                                        console.log('id '+item.document_id +""+item1.id);
                                                      if(item1.id==item.document_id){
                                                          retorno.push({texto: item.passage_text, file:item1.extracted_metadata.filename});
                                                      }

                                                    });

                  });

                   $scope.outputDiv = retorno;
                   $scope.outputTabela =[];
               }else {
                    angular.forEach(data.results, function(item){
                             //console.log('id '+item.id);
                             //console.log('author '+item.extracted_metadata.author);
                            // console.log('data publication '+item.extracted_metadata.publicationdate);
                            // console.log('filename '+item.extracted_metadata.filename);
                             //console.log('texto '+item.text);
                             //console.log('sentimento '+item.enriched_text.docSentiment.type);
                             retorno.push({autor: item.extracted_metadata.author,
                                           texto: item.text,
                                           filename:item.extracted_metadata.filename,
                                           id:item.id,
                                           sentimento:item.enriched_text.docSentiment.type,
                                           data_publicacao:item.extracted_metadata.publicationdate});
                     });
                     $scope.outputTabela = retorno;
                     $scope.outputDiv = [];
                 }


                if(retorno.length==0){
                  $scope.errorMessage='Registro não encontrado.';
                } else {
                   $scope.errorMessage='';
                }
                 /*try{
                      if(notIsEmpty(data)){
                           $scope.reset();
                           $scope.respostas = angular.fromJson(data);
                           $scope.output.push({ id:$scope.respostas._id, resposta : $scope.respostas.resposta,pergunta:$scope.respostas.pergunta  });
                      }

                   }catch(exception){
                      $scope.reset();
                      console.log('Exception tratada'+exception);
                      $scope.errorMessage='Registro não encontrado.';
                   }*/

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
                 // $scope.user={};
                  $scope.output=[];
                  $scope.myForm.$setPristine(); //reset Form
       };

       $scope.checkTrecho = function () {
           if ($scope.hasTrecho) {
                console.log("CheckBox is checked.");
           } else {
               console.log("CheckBox is not checked.");
           }
        };

});