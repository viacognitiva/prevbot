(function () {
    'use strict';

    angular.module('app.chatService', [])
        .factory('chatService', chatService);

    chatService.$inject = ['$http','$filter','$log','$q'];

    function chatService($http, $filter, $log, $q) {




        return {
            myRedirect: myRedirect
        };



         function myRedirect(redirectUrl, arg, value) {

            var form = $('<form action="' + redirectUrl + '" method="get">' +
            '<input type="text" name="'+ arg +'" value="' + value + '"></input></form>');
             $('body').append(form);
             $(form).submit();
       }



    }
})();
