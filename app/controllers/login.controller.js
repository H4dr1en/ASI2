var request = require('request');

module.export = this;

this.login = function (req, res) {

    var data = "";
    req.on('data', function(chunk){ data += chunk})
    req.on('end', function(){
        req.rawBody = data;
        req.jsonBody = JSON.parse(data);
        var clientServerOptions = {
            uri: 'http://localhost:8080/FrontAuthWatcherWebService/rest/WatcherAuth',
            body: data,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        request(clientServerOptions, function (error, response) {
            if(error){
                res.status(500).json(error);
                return;
            }
            var body = "";
            response.on('data', chunk => {
                body += chunk.toString();
            });
    
            response.on('end', () => {
                let obj = JSON.parse(body);
                res.type("json").json(obj)
            });
            return;
        });
    })
}