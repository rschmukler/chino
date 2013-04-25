var isBrowser = require('is-browser');

var data = {};

var DataStore = module.exports = {
  _lookupMethods: [],

  addLookupIdMethod: function(method) {
    DataStore._lookupMethods.push(method);
  },

  addObject: function(obj) {
    var id = getIdForObject(obj);
    data[id] = obj;
    return id;
  },

  dump: function() {
    return data;
  },

  get: function(id) {
    if(data[id])
      return data[id];
    else
      return null;
  }
};

if(isBrowser) {
  DataStore.init = function() {
    data = window._chinoDataStore;
    //delete window._chinoDataStore;
  };
}


function getIdForObject(obj) {
  for(var i = 0; i < DataStore._lookupMethods.length; ++i) {
    var method = DataStore._lookupMethods[i];
    if(obj[method]) {
      if(typeof obj[method] == 'function') {
        return obj[method]();
      }
      else
        return obj[method];
    }
  }

  // We couldn't lookup an ID, so let's make one.
  var idString = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(i = 0; i < 16; ++ i) {
    idString += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return idString;
}
