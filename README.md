# static abilities [![Build Status](https://travis-ci.org/vitoravelino/static-abilities.svg?branch=master)](https://travis-ci.org/vitoravelino/static-abilities) [![Coverage Status](https://img.shields.io/coveralls/vitoravelino/static-abilities.svg)](https://coveralls.io/r/vitoravelino/static-abilities) [![Code Climate](https://codeclimate.com/github/vitoravelino/static-abilities/badges/gpa.svg)](https://codeclimate.com/github/vitoravelino/static-abilities)

Static abilities generator for role based authorization.

Having to write hard-coded roles and abilities can be boring and hard to maintain. This library tries to help and speed up the way you write the roles and abilities needed to your application.

## Installation

You can install it using Bower:

```
$ bower install static-abilities
```

or using npm:

```
$ npm install static-abilities
```

## API

### Abilities.define(role[, callback])

It defines a role. This is the staring point of creating roles and associating permissions to it.
         
```javascript
Abilities.define('role', function(can, extend) {
    // ...
});
```

The callback is optional but it wouldn't make much sense to define a role without any abilities, right?

**NOTE:** callback function gets `can` and `extend` as parameters. Those will be explained below.

#### can(permissions[, resource])

Adds a permission (or a set of them) to the role you are defining.
     
If you omit `resource` you are going to associate a single and specific permission to the role.

```javascript
Abilities.define('role', function(can, extend) {
    can('specific_permission');
});
```
     
Otherwise, if you pass a resource it will build a permission as a concatenation of `permission` and `resource` like `<permission>_<resource>`. 

Check the example below:

```javascript
Abilities.define('role', function(can, extend) {
    can('read', 'resource'); // read_resource
    can(['read', 'edit', 'delete'], 'resource2'); // read_resource2, edit_resource2, delete_resource2
});
```

#### extend(roles)

Extends a role based on a role that was previously defined. It expects a `String` or `Array`.
     
```javascript
Abilities.define('role', function(can, extend) {
    extend('role2');
    extend(['role3', 'role4']);
});
```

### Abilities.alias(name, permissions)

Creates an alias to permission(s).
         
It's useful to avoid duplication of abilities definitions, especially when you are handling a CRUD application.
         
```javascript
Abilities.alias('crud', ['create', 'read', 'update', 'delete']);

Abilities.define('role', function(can, extend) {
    can('crud', 'resource');
});
```

The example above means the same thing as below:

```javascript
Abilities.define('role', function(can, extend) {
    can('create', 'resource');
    can('read', 'resource');
    can('update', 'resource');
    can('deleted', 'resource');
    
    // or
    
    can(['create', 'read', 'update', 'delete'], 'resource');
});
```

**NOTE:** A built-in alias `manage` is defined for `read`, `edit` and `delete`.


### Abilities.toJSON()

Returns the JSON map reference for what you've written.

Let's suppose that we've defined something like:

```javascript
Abilities.define('role', function(can, extend) {
    can('specific_permission');
    can('read', 'resource');
});
```

The `Abilities.toJSON()` call would return:

```javascript
{
    role: {
        'specific_permission',
        'read_resource'
    }
}

```

### Abilities.flush()

It flushes all the previously defined roles.

```javascript
Abilities.flush();
```

This can be quite useful if you, for example, build your own role based authorization and want to test it.

## Testing

You'll need to have nodejs and grunt-cli package installed.

Then just run `grunt jasmine`.

## License

The MIT License (MIT)

Copyright © 2015 Vítor Avelino <<contact@vitoravelino.me>>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
