require('dotenv').config()

var allowed_tokens = process.env.TOKENS ? process.env.TOKENS.split(/\s+/) : [];

var api = require(__dirname + '/src/api.js')()

// load scripts from file
api.loadScriptsFromFile(__dirname + '/data/scripts.json').catch(function(err) {
  console.log('Could not load scripts from file:', err);
  process.exit(1);
});

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')();


if (allowed_tokens && allowed_tokens.length) {
  // require an access token
  webserver.use(function(req, res, next) {

    if (req.url.match(/^\/api\//)) {
      if (!req.query.access_token) {
        res.status(403);
        res.send('Access denied');
      } else {

        // test access_token against allowed tokens
        if (allowed_tokens.indexOf(req.query.access_token) >= 0) {
          next();
        } else {
          res.status(403);
          res.send('Invalid access token');
        }
      }
    } else {
        next();
    }
  })
}

  // receives: triggers, user
  webserver.post('/api/v1/commands/triggers', function(req, res) {
    // look for triggers
    api.evaluateTriggers(req.body.triggers).then(function(results) {
          results.id = results.command;
          res.json(results);
    }).catch(function() {
      res.json({});
    })

  });

  // receives: command, user
  webserver.post('/api/v1/commands/name', function(req, res) {
    api.getScript(req.body.command).then(function(script) {
      res.json(script);
    }).catch(function(err) {
      if (err) {
        console.error('Error in getScript',err);
      }
      res.json({});
    })
  });

    // receives: command, user
    webserver.post('/api/v1/commands/id', function(req, res) {
      api.getScriptById(req.body.id).then(function(script) {
        res.json(script);
      }).catch(function(err) {
        if (err) {
          console.error('Error in getScript',err);
        }
        res.json({});
      })
    });


    // receives: command, user
    webserver.get('/api/v1/commands/list', function(req, res) {

      api.getScripts(req.query.tag).then(function(scripts) {
        res.json(scripts);
      }).catch(function(err) {
        if (err) {
          console.error('Error in getScripts',err);
        }
        res.json({});
      })
    });

    // receives: command, user
    webserver.post('/api/v1/stats', function(req, res) {

      res.json({});

    });
