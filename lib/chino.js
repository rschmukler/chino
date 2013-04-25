var isBrowser = require('is-browser'),
    DataStore = require('./data-store');

exports.DataStore = DataStore;
exports.View = require('./view');
exports.isBrowser = isBrowser;

exports.use = function(plugin) {
  plugin(this);
};

if(!isBrowser)
{
  exports.BuilderPlugins = require('./build');
  exports.Middleware = require('./middleware');
} else {
  var domready = require('domready'),
          glue = require('./view/glue.js');

  exports.Views = {};
  exports.ready = function(fn) {
    domready(function() {
      glue();
      DataStore.init();
      if(typeof fn != 'undefined') fn();
    });
  };
}
