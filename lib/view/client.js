var Chino = require('../chino'),
    DataStore = require('../data-store')(),
    View = require('./index');
    extend = require('extend');


View.engine = View.engine || require('dom');

module.exports = function(ChinoView) {

  ChinoView._readTemplate = function() {
    var template = this._filePath().replace(/\.jade/, '.js');
    var globalRequire = window.require;
    this._renderer = globalRequire(template);
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
    this.$el = View.engine(this.View._renderer(variables));
    this._postRenderTemplate();
    if(this.setEvents) this.setEvents.call(this);
    return this.toHTML();
  };

  ChinoView.prototype.toHTML = function() {
    return this.$el;
  };

  ChinoView.prototype.renderChild = function(view, locals) {
    return view.render(locals);
  };
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
  if(!(attrs instanceof Model)) {
    this.locals[obj] = new Model(this.locals[obj]);
    return true;
  } else {
    return false;
  }
}
