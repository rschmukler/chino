var Chino = require('../chino'),
    DataStore = Chino.DataStore,
    View = require('./index');
    extend = require('extend');


View.engine = View.engine || require('dom');

module.exports = function(ChinoView) {

  ChinoView._readTemplate = function() {
    var template = this._filePath().replace(/\.jade/, '.js');
    var globalRequire = window.require;
    this._renderer = globalRequire(template);
  };

  ChinoView.prototype._parseLocals = function() {
    this.locals = DataStore.get(this.$el.attr('data-chino-id'));
    for(var obj in this.View._specials) {
      if(this.locals[obj]) this.locals[obj] = new this.View._specials[obj](this.locals[obj]);
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
};
