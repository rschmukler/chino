var isBrowser = require('is-browser');

exports.View = require('./view');
exports.isBrowser = isBrowser;

if(!isBrowser)
{
  exports.BuilderPlugins = require('./build');
  exports.Middleware = require('./middleware');
}
