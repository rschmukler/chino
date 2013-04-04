var isBrowser = require('is-browser');

exports.View = require('./view');
exports.isBrowser = isBrowser;

if(!isBrowser)
{
  exports.BuilderPlugins = require('./build');
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
