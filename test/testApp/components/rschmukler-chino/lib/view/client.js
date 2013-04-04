dom = require('dom');
extend = require('extend');

module.exports = function(ChinoView) {
  ChinoView._readTemplate = function() {
    var template = this._filePath().replace(/\.jade/, '.js');
    var globalRequire = window.require;
    this._renderer = globalRequire(template);
  };

  ChinoView.prototype.renderTemplate = function(locals) {
    window.item = this;
    var variables = extend({view: this}, this.locals, locals);
    this.$el = dom(this.View._renderer(variables));
    this._postRenderTemplate();
    if(this.setEvents) this.setEvents.call(this);
    return this.$el;
  };
};
