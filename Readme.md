
# chino

  Jade based views that render server and client side

## Installation

    $ component install rschmukler/chino

## API

### Creating Views

There are two ways to create new views in `Chino`. 

#### Chino.View(name, path-to-templates, options)

This method requires all essential variables to be passed in as arguments.

    var Chino = require('chino');

    var path = (Chino.isBrowser ? 'todo-item' : __dirname);

    var TodoItem = Chino.View('TodoItem', path, {template: 'todo-item.jade'});

#### Chino.View(baseObject)

This method requires an object that will be extended to create the view
template. Required properties for this object are: `_name`, `_basePath`, and
`_template`

    var Chino = require('chino');
    var path = (Chino.isBrowser ? 'todo-item' : __dirname);

    var TodoItem = Chino.View({
      name: 'TodoItem',
      basePath: path,
      template: 'todo-item.jade'
    })

### Gluing Views

After you have defined your views, you can use `Chino.ready` to apply Chino's
glue. Chino's glue will find views rendered server side and instantiate client
side equivalents with the appropriate DOM elements. This means that you can
define events for views rendered server side and have them apply client side.

## License

  MIT
