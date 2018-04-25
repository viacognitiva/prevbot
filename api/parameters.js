require('dotenv-safe').load();

var params = {

    showSound : function(req, res){

        data = {};

        if(process.env.WATSON_AUDIO == 'S'){
            data = {retorno:'true'};
        }else{
            data = {retorno:'false'};
        }

        res.status(200).json(data);

    },

    showLog : function(req, res){

        data = {};

        if(process.env.SHOW_LOG == 'S'){
            data = {retorno:'true'};
        }else{
            data = {retorno:'false'};
        }

        res.status(200).json(data);

    }

}

module.exports = params;