jade = require('jade');

module.exports = function(ChinoView) {
  ChinoView._filePath = function() {
    return this._basePath + '/' + this._template;
  };

  ChinoView._readTemplate = function() {
    var fs = require('fs'),
    read = fs.readFileSync;
    var template = read(this._filePath(), 'utf-8');
    var options = {};
    options.filename = this._filePath();

    this._renderer = jade.compile(template, options);
  };

  ChinoView.prototype.render = function(locals) {
    if(process.env.environment == 'development') {
      this.View._readTemplate();
    }

    if(typeof(locals) != 'undefined') this.locals = locals;

    return this.View._renderer(this.locals);
  };
};
