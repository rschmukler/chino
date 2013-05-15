var isBrowser = require('is-browser'),
    extend = require('extend'),
    Chino = require('../chino.js');

var emitter;
if(isBrowser)
  emitter = require('emitter');
else
  emitter = function(obj) {
    var methods = ['on', 'off', 'once', 'emit'];
    var noop = function() { };
    for(var i = 0; i < methods.length; ++i) {
      obj[methods[i]] = noop;
    }
    obj.hasListeners = function() { return false; };
    obj.listeners = function() { return []; };
  };

var ChinoView = module.exports = {};
    ChinoView.prototype = {};

ChinoView.extend = function() {
  var SPECIAL_PROPS = ['basePath', 'name', 'template', 'specials', 'elements', 'uiEvents', 'chinoEvents'],
      i;

  var args = Array.prototype.slice.call(arguments);

  args.splice(0, 0, {});
  var obj = extend.apply(this, args);

  var NewView = function(locals) {
    initializeChinoView.call(this, locals);
    if(this.initialize)
      this.initialize();
    this.emit('initialize');
    loadElements.call(this);

    if(isBrowser && this.$el)
      this.emit('ready');
  };

  var NewViewAttrs = {};
  for(i = 0; i < SPECIAL_PROPS.length; ++i) {
    var propName = SPECIAL_PROPS[i];
    NewViewAttrs['_' + propName] = obj[propName];
    delete obj[propName];
  }

  NewViewAttrs = extend(true, {}, this, NewViewAttrs);
  NewView = extend(true, NewView, NewViewAttrs);
  NewView.prototype = extend({}, this.prototype, obj);

  // Set Defaults
  NewView._template = NewView._template || 'template.jade';

  // Prep the View Object

  // Add it the list of client views
  if(Chino.Views)
    Chino.Views[NewView._name] = NewView;

  NewView._readTemplate();

  return NewView;

  function initializeChinoView(locals) {
    emitter(this);
    this.View = NewView;
    this.locals = extend({}, locals);
    if(isBrowser) {
      //Check to see if we have an el instead of locals
      if(locals && (locals instanceof NewView.engine || typeof locals.length == 'function')) {
        this.$el = NewView.engine(locals);
        this.$el.attr('data-chino-init', true);
        this._readFromDataStore();
      }
      setChinoEvents.call(this);
      setUiEvents.call(this);
    } else {
      this.$el = require('cheerio').load('');
    }
  }
};


//////////////////////
//
// Static Methods
//
//////////////////////

ChinoView._filePath = function() {
  return this._basePath + '/' + this._template;
};


ChinoView.use = function(plugin) {
  plugin(ChinoView);
};

ChinoView.toString = function() { return this._name; };

if(isBrowser) {
  require('./client');
} else {
  require('./server');
}

//////////////////////
//
// Instance Methods
//
//////////////////////

ChinoView.prototype.toString = function() { return this.View._name + ' instance'; };

ChinoView.prototype.render = function(locals) {
  this.renderTemplate(locals);
  loadElements.call(this);
  if(this.postRender) this.postRender.call(this);
  this.emit('ready');
  return this.toHTML();
};

ChinoView.prototype._postRenderTemplate = function() {
  this.$el.attr('data-view-name', this.View._name);
  if(!isBrowser) {
    this._storeInDataStore();
  }
};

//////////////////////
//
// Private Methods
//
//////////////////////

function setChinoEvents() {
  if(isBrowser) {
    for(var key in this.View._chinoEvents) {
      var functionName = this.View._chinoEvents[key],
          functions = functionName.replace(/ /g, '').split(',');

      for(var i = 0; i < functions.length; ++i) {
        this.on(key, this[functions[i]].bind(this));
      }
    }
  }
}

function setUiEvents() {
  if(isBrowser) {
    if(this.$el) {
      this.on('destroy', removeUiEvents.bind(this));
      for(var key in this.View._uiEvents) {
        var args = key.split(' '),
            event = args.shift(),
            selector = args.join(' '),
            functionName = this.View._uiEvents[key];

        if(selector.length)
          this.$el.on(event, selector, this[functionName].bind(this));
        else
          this.$el.on(event, this[functionName].bind(this));
      }
    } else
      this.on('ready', setUiEvents.bind(this));
  }
}

function removeUiEvents() {
  for(var key in this.View._uiEvents) {
    var args = key.split(' '),
        event = args.shift();

    this.$el.off(event);
  }
}

function loadElements() {
  if(!this.$el) return;

  for(var key in this.View._elements) {
    var variableName = '$' + key,
        selector = this.View._elements[key];

    var $el;

    if(this.$el.find)
      $el = this.$el.find(selector);
    else
      $el = this.$el(selector);

    if($el.length)
      this[variableName] = $el;
  }
}
