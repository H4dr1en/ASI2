var http = require('http');

module.export = this;

this.login = function (req, res) {

    var options = {
        host: 'localhost',
        port: 80,
        path: '/foo.html'
    };

    http.get(options, resp => {

        var body = "";

        resp.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });

        resp.on('end', () => {
            let obj = JSON.parse(body);
            console.log(obj);
        });


    }).on("error", function (e) {
        console.log("Got error: " + e.message);
    });
}