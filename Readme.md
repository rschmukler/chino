
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

    var path = (typeof __dirname == 'undefined' ? 'todo-item' : __dirname);

    var TodoItem = Chino.View('TodoItem', path, {template: 'todo-item.jade'});

#### Chino.View(baseObject)

This method requires an object that will be extended to create the view
template. Required properties for this object are: `_name`, `_basePath`, and
`_template`

    var Chino = require('chino');
    var path = (typeof __dirname == 'undefined' ? 'todo-item' : __dirname);

    var TodoItem = Chino.View({
      name: 'TodoItem',
      basePath: path,
      template: 'todo-item.jade'
    })

## License

  MIT
