(function() {
    'use strict';

    var define = Abilities.define.bind(Abilities);

    define('reader', function(can) {
        can('read', 'blacklist');
        can('read', 'campaigns');
    });

    define('blacklist_editor', function(can, extend) {
        extend('reader');

        can('manage', 'blacklist'); // alias to ['read', 'edit', 'delete']
    });

    define('editor', function(can, extend) {
        extend('blacklist_editor');

        can('manage', 'campaigns');
    });

}());
