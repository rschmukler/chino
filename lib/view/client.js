var Chino = require('../chino'),
    DataStore = require('../data-store')(),
    ChinoView = require('./index'),
    extend = require('extend');


ChinoView.engine = ChinoView.engine || require('dom');

ChinoView._readTemplate = function() {
  try {
    var template = this._filePath().replace(/\.jade/, '.js');
    var globalRequire = window.require;
    this._renderer = globalRequire(template);
  } catch (e) { }
};

ChinoView._readOtherTemplates = function() {
  var globalRequire = window.require;

  for(var key in this._templates) {
    this._templates[key] = globalRequire(this._basePath + '/' + this._templates[key].replace(/\.jade/, '.js'));
  }
};

ChinoView.prototype._readFromDataStore = function() {
  var locals = DataStore.get(this.$el.attr('data-chino-id'));
  if(locals) {
    this.locals = locals;

    //Instantiate the specials
    for(var obj in this.View._specials) {
      var Model = this.View._specials[obj];

      var wasSpecial = resolveChinoObjects.call(this, obj);
      var instantiated = instantiateSpecials.call(this, Model, obj);

      if(wasSpecial && instantiated) {
        DataStore.replaceObject(this.locals[obj], wasSpecial);
      }
    }

  } else {
    this.locals = {};
  }
};

ChinoView.prototype.renderTemplate = function(locals) {
  window.item = this;
  var variables = extend({view: this}, this.locals, locals);
  var $renderedEl = ChinoView.engine(this.View._renderer(variables));
  if(this.$el) {
    this.$el.replaceWith($renderedEl);
    this.$el = $renderedEl;
  }
  else
    this.$el = $renderedEl;

  this._postRenderTemplate();
  if(this.setEvents) this.setEvents.call(this);
  return this.toHTML();
};

ChinoView.prototype.toHTML = function() {
  return this.$el;
};

ChinoView.prototype.renderChild = function(view, locals) {
  this.on('destroy', function() { view.emit('destroy'); });
  return view.render(locals);
};

function resolveChinoObjects(obj) {
  var id = this.locals[obj] ? this.locals[obj]._chinoFromId : undefined;
  if(id) {
    this.locals[obj] = DataStore.get(id);
    return id;
  }
  return false;
}

function instantiateSpecials(Model, obj) {
  var attrs = this.locals[obj];
  if(attrs  && !(attrs instanceof Model)) {
    this.locals[obj] = new Model(this.locals[obj]);
    return true;
  } else {
    return false;
  }
}
