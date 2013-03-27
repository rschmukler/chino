var isBrowser = require('is-browser'),
    extend = require('extend'),
    jade;


 module.exports = function createView() {
  var View = function(locals) {
    this.View = View;
    this.locals = locals;

    this.$el = isBrowser ? require('dom') : require('cheerio').load('');

    if(this.initialize) this.initialize.call(this);
  };

  var args = Array.prototype.slice.call(arguments);

  if(args.length >= 2) {
    View._name = args.shift();
    View._basePath = args.shift();

    options = args.shift() || {};
    View._template = options.template || './template.jade';
  } else {
    var cloneObject = args.shift();

    for(var key in cloneObject) {
      View['_' + key] = cloneObject[key];
    }
  }

  extend(View, ChinoView);
  extend(View.prototype, ChinoView.prototype);


  View._readTemplate();

  View.extend = function(object) {
    extend(View.prototype, object);
  };

  return View;
};

var ChinoView = function ChinoView() { };

ChinoView._filePath = function() {
  return this._basePath + '/' + this._template;
};


ChinoView.use = function(plugin) {
  plugin(ChinoView);
};

if(isBrowser) {
  ChinoView.use(require('./client'));
} else {
  ChinoView.use(require('./server'));
}

ChinoView.prototype.toString = function() { return this._name; };
ChinoView.prototype.render = function(locals) { return this.renderTemplate(); };

