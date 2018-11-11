var request = require('request');

module.export = this;

this.login = function(req, res) {

    var data = "";
    req.on('data', function(chunk) { data += chunk })
    req.on('end', function() {
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
        request(clientServerOptions, function(error, response, body) {
            if (error || response.statusCode === 500) {
                res.status(500).json(error || { error: "500 from auth" });
                return;
            }
            let obj = JSON.parse(body);
            if (obj.validAuth === true) {
                res.status(200).json(obj)
            }
            else {
                res.status(403).json(obj)
            }
            return;
        });
    })
}