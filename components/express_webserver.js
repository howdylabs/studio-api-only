var express = require('express');
var bodyParser = require('body-parser');
var querystring = require('querystring');

module.exports = function() {


    var webserver = express();
    webserver.use(bodyParser.json());
    webserver.use(bodyParser.urlencoded({ extended: true }));

    webserver.use(express.static('public'));

    webserver.listen(process.env.PORT || 3000, null, function() {

        console.log('Express webserver configured and listening at http://localhost:' + (process.env.PORT || 3000));

    });

    return webserver;

}
