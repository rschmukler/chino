var isBrowser = require('is-browser'),
    extend = require('extend'),
    Chino = require('../chino.js');

 module.exports = function createView() {
  var View = function(locals) {
    this.View = View;
    this.locals = locals || {};


    if(isBrowser) {
      //Check to see if we have an el instead of locals
      if(locals && typeof(locals.length) == 'function') {
        this.$el = locals;
        this._parseLocals();
      }
    } else {
      this.$el = require('cheerio').load('');
    }



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

  if(isBrowser) {
    Chino.Views[View._name] = View;
  }

  return View;
};

// Static Methods

var ChinoView = function ChinoView() { };

ChinoView._filePath = function() {
  return this._basePath + '/' + this._template;
};


ChinoView.use = function(plugin) {
  plugin(ChinoView);
};

ChinoView.toString = function() { return this._name; };

if(isBrowser) {
  ChinoView.use(require('./client'));
} else {
  ChinoView.use(require('./server'));
}

// Instance Methods

ChinoView.prototype.toString = function() { return this.View._name + ' instance'; };
ChinoView.prototype.render = function(locals) { return this.renderTemplate(locals); };
ChinoView.prototype._postRenderTemplate = function() {
  this.$el.attr('data-view-name', this.View._name);
};

