
//const queryBuilder = require('./config/query-builder');


var request=require('request');

/*

var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var discovery = new DiscoveryV1({
  username: '031295b2-eaf4-4bea-af38-897ac00f665a',
  password: 'wN3LgnWp6gd1',
  version_date: '2017-06-25'
});


const entities = [
  'nested(enrichedTitle.entities).filter(enrichedTitle.entities.type:Company).term(enrichedTitle.entities.text)',
  'nested(enrichedTitle.entities).filter(enrichedTitle.entities.type:Person).term(enrichedTitle.entities.text)',
  'term(enrichedTitle.concepts.text)',
];

const sentiments = [
  'term(blekko.basedomain).term(docSentiment.type)',
  'term(docSentiment.type)',
  'min(docSentiment.score)',
  'max(docSentiment.score)',
];

const mentions = [
  // eslint-disable-next-line
  'filter(enrichedTitle.entities.type::Company).term(enrichedTitle.entities.text).timeslice(blekko.chrondate,1day).term(docSentiment.type)'
];*/





 var discoveryWatson = {
     get : function(req, res) {
        var texto = req.params.texto;
        console.log("paramentros"+req.params.full);

        if(typeof req.params.full == 'undefined'){
          full=false;
        }else full=JSON.parse(req.params.full);

        console.log("Buscando palavra "+texto);

        const environmentId = process.env.DISCOVERY_ENVIRONMENT || 'c3e2bd90-5ded-4d01-9ff0-46cc457aec29';
        const collectionId = process.env.DISCOVERY_COLLECTION || '7a132e97-a463-4bf4-9500-da29d2783fbd';
        const baseQuery = `/discovery/api/v1/environments/${environmentId}/collections/${collectionId}/query`;
        const version = 'version=2016-11-09';

        const username = process.env.DISCOVERY_USERNAME || 'c28e96ae-c74d-421a-be65-dad4dadffc4f';
        const password = process.env.DISCOVERY_PASSWORD || 'a88x8YMEAN0j';
        const apiHostname = process.env.DISCOVERY_HOST || 'gateway.watsonplatform.net';
        var passages = '';
        if(full){
          passages = 'passages=true&';
        }
        const query = passages+'natural_language_query='+texto;
        const fullUrl = `https://${username}:${password}@${apiHostname}${baseQuery}?${version}&${query}`;

        console.log(fullUrl);

        request.get(fullUrl,function(err,resp,body){
              if(err){
                 console.log(" discoveryWatson.get Error: "+JSON.parse(body));
              }
              //res.status(200).json(JSON.parse(body));
              res.status(200).json(JSON.parse(body));

        });

       /*
         var queryParams = {
           //query:texto,
           natural_language_query:texto,
         //  passages:true,
           environment_id: 'c5bd48f5-619e-4a74-9c84-ed9681f3a336',
           collection_id: '76764baf-0b3d-4bf0-87ba-74ad78d22eb9'     };

          if (full) {
                 queryParams.aggregations = [].concat(entities, sentiments, mentions);
          }

         console.log(queryParams);

         discoveryqueryParams.query(, function(error, data) {
             //console.log(JSON.stringify(data, null, 2));
             res.status(200).json(data);
      });*/
  }
}


module.exports = discoveryWatson;