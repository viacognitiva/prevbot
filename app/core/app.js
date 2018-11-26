(function () {
    'use strict';

    angular.module('app', [
        'ui.router',
        'app.index',
        'app.user',
        'app.chat',
        'app.saudacao',
        'app.fim',
        'app.directives.divSize',
        'app.directives.campoData'
    ]);
})();
