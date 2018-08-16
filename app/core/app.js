(function () {
    'use strict';

    angular.module('app', [
        'ui.router',
        'app.index',
        'app.user',
        'app.chat',
        'app.directives.divSize'
    ]);
})();
