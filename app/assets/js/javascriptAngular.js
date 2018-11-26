function angularOptionMessage(value) {

    var scope = angular.element(document.getElementById('chatScreen')).scope();
    scope.CC.optionMessage(value);
    $(".opcao").attr("class", "disabled");

}

function contQuestionario(objeto) {
    
    var opc = objeto.split("|");
    var scope = angular.element(document.getElementById('chatScreen')).scope();

    scope.CC.optionMessage(opc[0]);
    scope.CC.gravaQuestionario('questionario',scope.CC.respQuest, opc[0], opc[1]);
    $(".opcao").attr("class", "disabled");
    scope.CC.processaQuestionario(opc[1]);

}

function contSimulador(resposta) {

        var scope = angular.element(document.getElementById('chatScreen')).scope();

        scope.CC.simuladorMessage(resposta);
        scope.CC.gravaQuestionario('simulador',scope.CC.respQuest, resposta, '0');
        $(".opcao").attr("class", "disabled");
        scope.CC.processaSimulador();
    
}