var isBrowser = require('is-browser'),
    extend = require('extend'),
    jade;


 module.exports = function createView(name, path, options) {
  options = options || {};
  var View = function(locals) {
    this.View = View;
    this.locals = locals;

    this.$el = isBrowser ? require('dom') : require('cheerio').load('');


    if(this.initialize) this.initialize.call(this);
  };

  extend(View, ChinoView);
  extend(View.prototype, ChinoView.prototype);

  View.prototype.toString = function() { return name; };

  View._basePath = path;
  View._template = options.template || './template.jade';
  View._tagName = options.tagName || 'div';
  View._readTemplate();

  View.extend = function(object) {
    extend(View.prototype, object);
  };

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
