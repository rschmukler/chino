var isBrowser = require('is-browser');

exports.View = require('./view');

if(!isBrowser)
{
  exports.BuilderPlugins = require('./build');
  exports.Middleware = require('./middleware');
}
