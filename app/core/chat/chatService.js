(function () {
    'use strict';

    angular.module('app.chatService', [])
        .factory('chatService', chatService);

    chatService.$inject = ['$http','$q','$log'];

    function chatService($http, $q, $log) {

        var config = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        };

        return {
            getQuestionario: getQuestionario,
            getCategoria: getCategoria,
            getFundos: getFundos,
            setQuestionario: setQuestionario,
            setLog: setLog,
            setOutros: setOutros,
            sendMail: sendMail,
            getValMinimo: getValMinimo,
            getQuestSimulador: getQuestSimulador,
            getCalculoContribMes: getCalculoContribMes
        };
        
        function getQuestionario() {            
            return $http.get('/api/getquest', config)
                .then(procResponse)
                .catch(procError);
        }

        function setQuestionario(tipo, resposta, mensagem, peso) {
            
            resposta.config.data.text = mensagem;
            resposta.data.input.text = mensagem;
            resposta.data.input.peso = parseFloat(peso);
            resposta.data.intents.intent = tipo;
            resposta.data.output.generic[0].text = '';
            resposta.data.output.text[0] = '';

            for (var vlr in resposta.data.output.nodes_visited){
                delete resposta.data.output.nodes_visited[vlr]
            }

            setLog(resposta)

        }

        function getQuestSimulador() {

            var quests = [
                {
                    'pergunta':'Qual a sua data de nascimento?',
                    'tipo':'data',
                    'opcoes':'-',
                    'msgErro':'Data de nascimento inválida',
                    'subpergunta':[]
                },
                {
                    'pergunta':'Sexo?',
                    'tipo':'opcao',
                    'opcoes':['Masculino','Feminino'],
                    'msgErro': '-',
                    'subpergunta': []
                },
                {
                    'pergunta':'Você gostaria de se aposentar com quantos anos?',
                    'tipo':'numero',
                    'opcoes':'-',
                    'msgErro': 'Idade inválida, favor inserir a data novamente...',
                    'subpergunta': []
                },
                {
                    'pergunta':'Você pretende fazer uma aplicação inicial? De quanto?',
                    'tipo':'numero',
                    'opcoes':'-',
                    'msgErro': 'Valor inválido, favor inserir um novo valor...',
                    'subpergunta': []
                },
                {
                    'pergunta':'Qual a rentabilidade líquida estimada (%a.a.) que gostaria de simular? Caso não saiba, estaremos utilizando a rentabilidade líquida de 5% a.a.',
                    'tipo':'numero',
                    'opcoes':'-',
                    'msgErro': 'Valor inválido, favor inserir um novo valor...',
                    'subpergunta': []
                },
                {
                    'pergunta': 'Qual a opção de simulação deseja realizar?',
                    'tipo':'opcao',
                    'opcoes': ['Renda por mês', 'Contribuição por mês'],
                    'msgErro': '-',
                    'subpergunta': ['Qual a renda mensal pretendida?', 'Qual a contribuição mensal desejada?']
                },
                {
                    'pergunta': '-',
                    'tipo': 'numero',
                    'opcoes': '-',
                    'msgErro': 'Valor inválido, favor inserir um novo valor...',
                    'subpergunta': '-'
                },
                {
                    'pergunta': 'Qual o seu principal objetivo?',
                    'tipo':'opcao',
                    'opcoes': ['Aposentadoria', 'Incentivo Fiscal', 'Não sei ainda'],
                    'msgErro': '-',
                    'subpergunta': []
                },
                {
                    'pergunta': 'Qual o tipo da sua Declaração de Imposto de Renda?',
                    'tipo':'opcao',
                    'opcoes': ['Simples', 'Completo', 'Não sei ou não declaro'],
                    'msgErro': '-',
                    'subpergunta': []
                }
            ]
             
            return quests;            
        }

        function getAtuarial(idade,tipo) {

            var info = {}
            info.tipo = tipo;
            info.idade = parseInt(idade);

            return $http.get('/api/getexp/' + JSON.stringify(info), config)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.log(error);
                });

        }

        function getCategoria(peso) {
            return $http.get('/api/getcateg/'+peso, config)
            .then(procResponse)
            .catch(procError);
        }

        function getFundos(valores) {
            return $http.get('/api/getfundos/' + JSON.stringify(valores), config)
            .then(procResponse)
            .catch(procError);
        }

        async function getCalculoContribMes(params,tipo) {
            
            var formato = {
                minimumFractionDigits: 2,
                style: 'currency',
                currency: 'BRL'
            };

            var retorno = {};

            var idade = getIdade(params[0].resposta);
            var atuarial = await getAtuarial(idade,tipo);
            var especVida = atuarial.ex;
            
            //espectativa de vida
            var espec = idade + especVida;

            //tempo de renda a receber em meses
            var TR = parseFloat(((espec - params[2].resposta) * 12).toFixed(1));

            //quantidade de meses de contribuição
            var TC = (params[2].resposta - idade) * 12;

            //contribuição mensal
            var CM = parseFloat(params[6].resposta);

            //contribuição inicial
            var CI = parseFloat(params[3].resposta);

            //taxa de juros anual
            if (params[4].resposta == ''){
                var TA = 5;
            } else {
                var TA = parseFloat(params[4].resposta);
            }            

            //taxa de juros ao mês
            var TM = parseFloat((((TA / 12) / 100) - 0.0001).toFixed(4));

            var P1 = parseFloat(Math.pow((1 + TM), TC).toFixed(4));
            var P2 = parseFloat(Math.pow((1 + TM), TR).toFixed(4));

            //valor futuro
            var VF = (((CI * P1) + (CM * (P1 - 1) / TM)));
            
            //valor parcela
            var VP = parseFloat(VF.toFixed(4)) * (TM / ((1-(1/ P2))));

            retorno.VF = VF.toLocaleString('pt-br', formato);
            retorno.VP = VP.toLocaleString('pt-br', formato);

            return retorno;

        }

        function getIdade(dtNasc) {

            var dataAtual = new Date();
            var anoAtual = dataAtual.getFullYear();

            var anoNascParts = dtNasc.split('/');
            var diaNasc = anoNascParts[0];
            var mesNasc = anoNascParts[1];
            var anoNasc = anoNascParts[2];

            var idade = anoAtual - anoNasc;
            var mesAtual = dataAtual.getMonth() + 1;
            
            if (mesAtual < mesNasc) {
                idade--;
            } else {
                if (mesAtual == mesNasc) {
                    if (dataAtual.getDate() < diaNasc) {
                        idade--;
                    }
                }
            }

            return idade;            
        }

        function getValMinimo() {

            return $http.get('/api/getvalmin', config).then(
                function successCallback(response) {
                    return response.data.docs[0].aplicacaoMinima;
                }, 
                function errorCallback(error) {
                    console.log('Error: ' + JSON.stringify(error));
                    return '0';
                }
            );

        }

        function setLog(value) {
            $http.post('/api/gravar', value).catch((error) => {
                console.log('Error: ' + JSON.stringify(error));
            });
        }

        function setOutros(value) {
            $http.post('/api/outros', value).catch((error) => {
                console.log('Error: ' + JSON.stringify(error));
            });
        }

        function sendMail(mailInfo) {
            $http.post('/api/sendmail', mailInfo).catch((error) => {
                console.log('Error: ' + JSON.stringify(error));
            });
        }

        function procResponse(response) {
            return response;
        }

        function procError(error) {
            var newMessage = 'XHR Failed for chatService.';
            $log.error(newMessage);
            $log.error(error);
            return $q.reject(error);
        }

        

    }
})();
