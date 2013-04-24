var isBrowser = require('is-browser');

exports.View = require('./view');
exports.DataStore = require('./data-store');
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
      if(typeof fn != 'undefined') fn();
    });
  };
}
