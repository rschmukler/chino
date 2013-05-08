var isBrowser = require('is-browser'),
    extend = require('extend'),
    Chino = require('../chino.js');


 var createView = module.exports = function createView() {
  var View = function(locals) {
    this.View = View;
    this.locals = locals || {};


    // Set $el
    if(isBrowser) {
      //Check to see if we have an el instead of locals
      if(locals && (locals instanceof createView.engine || typeof locals.length == 'function')) {
        this.$el = createView.engine(locals);
        this.$el.attr('data-chino-init', true);
        this._readFromDataStore();
      }
    } else {
      this.$el = require('cheerio').load('');
    }

    if(this.initialize) this.initialize.call(this);

    if(isBrowser && this.clientInitialize)
      this.clientInitialize.call(this);

    if(isBrowser && this.$el) {
      if(this.setEvents)
        this.setEvents.call(this);
      if(this.ready)
        this.ready.call(this);
    }

  };

  var args = Array.prototype.slice.call(arguments);

  View._specials = {};

  if(args.length >= 2) {
    View._name = args.shift();
    View._basePath = args.shift();

    options = args.shift() || {};
    View._template = options.template;
  } else {
    var cloneObject = args.shift();

    for(var key in cloneObject) {
      View['_' + key] = cloneObject[key];
    }
  }

  // Set some defaults
  View._template = View._template || 'template.jade';

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
ChinoView.prototype.render = function(locals) {
  this.renderTemplate(locals);
  if(this.postRender) this.postRender.call(this);
  if(this.ready) this.ready.call(this);
  return this.toHTML();
};
ChinoView.prototype._postRenderTemplate = function() {
  this.$el.attr('data-view-name', this.View._name);
  if(!isBrowser) {
    this._storeInDataStore();
  }
};

