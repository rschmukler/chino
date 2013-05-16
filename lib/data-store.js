var isBrowser = require('is-browser');

var clientStore, clientInit = false;

module.exports = function() {
  var data = {},
      DataStore;

  if(!clientStore) {
    DataStore = {
      _lookupMethods: [],

      addLookupIdMethod: function(method) {
        DataStore._lookupMethods.push(method);
      },

      addObject: function(obj) {
        if(obj) {
          var id = getIdForObject(DataStore, obj);
          if(!data[id])
            if(obj.toChinoDataStore)
              data[id] = obj.toChinoDataStore();
            else
              data[id] = obj;
          return id;
        } else {
          return null;
        }
      },

      replaceObject: function(obj, id) {
        id = id || getIdForObject(DataStore, obj);
        if(obj.toChinoDataStore)
          data[id] = obj.toChinoDataStore();
        else
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
  }

  if(isBrowser) {
    if(clientStore)
      return clientStore;

    DataStore.init = function() {
      if(!clientInit) {
        data = window._chinoDataStore;
        delete window._chinoDataStore;
        clientInit = true;
      }
    };
    clientStore = DataStore;
  }

  return DataStore;
};

function getIdForObject(ds, obj) {
  var result;
  if(obj._chinoDsId)
    return obj._chinoDsId;

  for(var i = 0; i < ds._lookupMethods.length; ++i) {
    var method = ds._lookupMethods[i];
    if(obj[method]) {
      if(typeof obj[method] == 'function') {
        result = obj[method]();
        break;
      }
      else {
        result = obj[method];
        break;
      }
    }
  }

  if(result) {
    return result;
  }

  // We couldn't lookup an ID, so let's make one.
  var idString = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(i = 0; i < 16; ++ i) {
    idString += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  obj._chinoDsId = idString;
  return idString;
}
