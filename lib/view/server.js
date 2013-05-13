var jade = require('jade'),
extend = require('extend'),
ChinoView = require('./index');

ChinoView.engine = ChinoView.engine || require('cheerio');

ChinoView._readTemplate = function() {
  var fs = require('fs'),
  read = fs.readFileSync;
  var template = read(this._filePath(), 'utf-8');
  var options = {};
  options.filename = this._filePath();

  this._renderer = jade.compile(template, options);
};

ChinoView.prototype.renderTemplate = function(locals) {
  if(process.env.environment == 'development') {
    this.View._readTemplate();
  }

  var variables = extend({view: this}, this.locals, locals);
  this.$el = ChinoView.engine.load(this.View._renderer(variables)).root().children().first();
  this._postRenderTemplate();
  return this.toHTML();
};

ChinoView.prototype.toHTML = function() {
  return this.$el.parent().html();
};

ChinoView.prototype.renderChild = function(view, locals) {
  if(this._ds && ! view._ds)
    view._ds = this._ds;

  return view.render(locals);
};

ChinoView.prototype._storeInDataStore = function() {
  var localCopy = extend(true, {}, this.locals);

  if(this._ds) {
    for(var key in this.View._specials) {
      var instance = localCopy[key];
      if(instance) {
        var insert = instance.toChinoStore ? instance.toChinoStore() : instance;
        var id = this._ds.addObject(insert);
        localCopy[key] = { _chinoFromId: id };
      }
    }
    this.$el.attr('data-chino-id', this._ds.addObject(localCopy));
  }
};
