module.exports = function(webserver) {


  webserver.get('/', function(req, res) {

    res.send('home');

  });



}
