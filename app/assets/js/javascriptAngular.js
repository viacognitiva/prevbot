function angularOptionMessage(value) {

    var scope = angular.element(document.getElementById('chatScreen')).scope();
    scope.CC.optionMessage(value);
    $(".opcao").attr("class", "disabled");

}

function contQuestionario(objeto) {
    
    var opc = objeto.split("|");
    var scope = angular.element(document.getElementById('chatScreen')).scope();

    scope.CC.optionMessage(opc[0]);
    $(".opcao").attr("class", "disabled");
    scope.CC.processaQuestionario(opc[1]);

}

function enviaFundo(texto) {
    var scope = angular.element(document.getElementById('chatScreen')).scope();

    
}