var isBrowser = require('is-browser'),
    extend = require('extend'),
    jade;


 module.exports = function createView(name, path, options) {
  options = options || {};
  var View = function(locals) {
    this.View = View;
    this.locals = locals;
  };

  extend(View, ChinoView);
  extend(View.prototype, ChinoView.prototype);

  View.prototype.toString = function() { return name; };

  View._basePath = path;
  View._template = options.template || './template.jade';
  View._readTemplate();

  return View;
};

var ChinoView = function ChinoView() { };

ChinoView.use = function(plugin) {
  plugin(ChinoView);
};

if(isBrowser) {
  ChinoView.use(require('./client'));
} else {
  ChinoView.use(require('./server'));
}
