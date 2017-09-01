
  var Cloudant = require('cloudant');
  var fs = require('fs');

    var cloudant_url="https://b6a29beb-91ed-4256-81c4-458e3ff55a71-bluemix:2cd1080e5c8ac457d9cbc3105aabfa7f28abfe45e03cae99eaa5910dbc84ab6a@b6a29beb-91ed-4256-81c4-458e3ff55a71-bluemix.cloudant.com";
    var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
    var user = 'b6a29beb-91ed-4256-81c4-458e3ff55a71-bluemix'; // Set this to your own account
    var password = '2cd1080e5c8ac457d9cbc3105aabfa7f28abfe45e03cae99eaa5910dbc84ab6a';

    if(process.env.VCAP_SERVICES)
    {
    	services = JSON.parse(process.env.VCAP_SERVICES);
    	if(services.cloudantNoSQLDB) //Check if cloudantNoSQLDB service is bound to your project
    	{
    		cloudant_url = services.cloudantNoSQLDB[0].credentials.url;  //Get URL and other paramters
    		user = services.cloudantNoSQLDB[0].credentials.username;
    		password = services.cloudantNoSQLDB[0].credentials.password;
    		console.log("Name = " + services.cloudantNoSQLDB[0].name);
    		console.log("URL = " + services.cloudantNoSQLDB[0].credentials.url);
            console.log("username = " + services.cloudantNoSQLDB[0].credentials.username);
    		console.log("password = " + services.cloudantNoSQLDB[0].credentials.password);
    	}
    }

    //Connect using cloudant npm and URL obtained from previous step


    //Edit this variable value to change name of database.
    var dbname = 'bdviacognitiva';

    // Initialize the library with my account.
    var cloudant = Cloudant({url: cloudant_url,account:user,password:password});
    db = cloudant.db.use(dbname);

    var cloudant = {
        get : function(req, res) {
         var id = req.params.id;
         console.log('id ='+id);
              db.get(id, function(err, data) {
                   res.status(200).json(data);
               });
      }
    };


module.exports = cloudant;
