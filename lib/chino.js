var isBrowser = require('is-browser'),
    dataStore = require('./data-store');

exports.View = require('./view');
exports.isBrowser = isBrowser;

exports.use = function(plugin) {
  plugin(this);
};

if(!isBrowser)
{
  exports.BuilderPlugins = require('./build');
  exports.Middleware = require('./middleware');
  exports.DataStore = dataStore;
} else {
  var domready = require('domready'),
          glue = require('./view/glue.js');

  exports.DataStore = dataStore();
  exports.Views = {};
  exports.ready = function(fn) {
    domready(function() {
      exports.DataStore.init();
      glue();
      if(typeof fn != 'undefined') fn();
    });
  };
}
