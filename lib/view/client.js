dom = require('dom');
extend = require('extend');

module.exports = function(ChinoView) {
  ChinoView._readTemplate = function() {
    var template = this._filePath().replace(/\.jade/, '.js');
    var globalRequire = window.require;
    this._renderer = globalRequire(template);
  };

  ChinoView.prototype.renderTemplate = function(locals) {
    window.objectLocals = this.locals;
    window.passedLocals = locals;
    var variables = extend({view: this}, this.locals, locals);
    window.variables = variables;
    this.$el = dom(this.View._renderer(variables));
    return this.$el.selector;
  };
};
