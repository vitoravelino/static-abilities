(function() {
    'use strict';

    var define = Abilities.define.bind(Abilities);

    define('reader', function(can) {
        can('read', 'resource1');
        can('read', 'resource2');
    });

    define('editor', function(can, extend) {
        extend('reader');

        can('manage', 'resource2'); // alias to ['read', 'edit', 'delete']
    });

    define('admin', function(can, extend) {
        extend('editor');

        can('manage', 'resource3');
    });

    console.log(Abilities.toJSON());

}());
