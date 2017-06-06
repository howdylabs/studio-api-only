module.exports = function(webserver) {

  var scripts = require('../../data/scripts.json');
  var triggers = [];

  function mapTriggers() {
    for (var s = 0; s < scripts.length; s++) {
      for (var t = 0; t < scripts[s].triggers.length; t++) {
        triggers.push({trigger: scripts[s].triggers[t], script: s});
      }
    }

    // sort in the order of _descending pattern length_
    triggers.sort(function(a,b) {

      return b.trigger.pattern.length - a.trigger.pattern.length;

    });
  }

  mapTriggers();

  function evaluateTriggers(query) {

    return new Promise(function(resolve, reject) {
      var res = [];

      // check regular expressions first
      for (var t = 0; t < triggers.length; t++) {
        var trigger = triggers[t].trigger;

        if (trigger.type == 'regexp') {

          var found = false;
          try {
            var test = new RegExp(trigger.pattern,'i');
            found = query.match(test);
          } catch(err) {
            console.log('ERROR IN REGEX', err);
          }

          if (found !== false && found !== null) {
              res.push(triggers[t].script);
          }
        }
      }

      for (var t = 0; t < triggers.length; t++) {
        var trigger = triggers[t].trigger;

        if (trigger.type == 'string') {

          var found = false;
          try {
            var test = new RegExp('^' + trigger.pattern + '\\b','i');
            found = query.match(test);
          } catch(err) {
            console.log('ERROR IN REGEX', err);
          }

          if (found !== false && found !== null) {
              res.push(triggers[t].script);
          }
        }
      }

      if (res.length) {
        resolve(scripts[res[0]]);
      } else {
        reject();
      }
    });

  }


  // receives: triggers, user
  webserver.post('/api/v1/commands/triggers', function(req, res) {

    // look for triggers
    evaluateTriggers(req.body.triggers).then(function(results) {
          results.id = results.command;
          res.json(results);
    }).catch(function() {
      res.json({});
    })

  });

  // receives: command, user
  webserver.post('/api/v1/commands/name', function(req, res) {

    for (var s = 0; s < scripts.length; s++) {
      if (req.body.command.toLowerCase() == scripts[s].command.toLowerCase()) {
        return res.json(scripts[s]);
      }
    }

    res.json({});

  });

}
