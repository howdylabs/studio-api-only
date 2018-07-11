module.exports = function(controller) {



  controller.studio.evaluateTrigger = function(bot, text, user) {

      var userHash = md5(user);
      var sdk = new SDK(genConfig(bot));
      return sdk.evaluateTrigger(text, userHash);

  };

  // get Botkit Studio identity
  controller.studio.identify = function(bot) {
      var sdk = new SDK(genConfig(bot || {}));
      return sdk.identify();
  };

  // get command list
  controller.studio.getScripts = function(bot, tag) {
      var sdk = new SDK(genConfig(bot || {}));
      return sdk.getScripts(tag);
  };

  // create a simple script
  // with a single trigger and single reply
  controller.studio.createScript = function(bot, trigger, text) {
      var sdk = new SDK(genConfig(bot || {}));
      return sdk.createScript(trigger, text);
  };

  // load a script from the pro service
  controller.studio.getScriptById = function(bot, id, user) {

      var userHash = md5(user);
      var sdk = new SDK(genConfig(bot));
      return sdk.getScriptById(id, user);
  };

  // load a script from the pro service
  controller.studio.getScript = function(bot, text, user) {

      var userHash = md5(user);
      var sdk = new SDK(genConfig(bot));
      return sdk.getScript(text, user);
  };





}
