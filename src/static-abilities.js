(function (root) {
    var toString = Object.prototype.toString;

    /**
     * Util class to encapsulate two functions to check if
     * an object is an array or a string.
     *
     * @type {Object}
     */
    var Util = {
        isArray: Array.isArray,

        isString: function(obj) {
            return toString.call(obj) === '[object String]';
        }
    };

    var roles = {};

    var aliases = {
        manage: ['read', 'edit', 'delete'] // built-in
    };

    /**
     * Adds a (set of) permission(s) to the role you are defining.
     *
     * The `resource` parameter is an optional. So, if you omit it like
     *
     * <code>can('permission')</code>
     *
     * you are going to associate a single permission called `permission` to the
     * role.
     *
     * Otherwise, if you pass a resource like
     *
     * <code>can('permission', 'resource')</code>
     *
     * it will associate a permission that it's gonna be build like `permission_resource`
     * to the role.
     *
     * This is an internal function that will be called with the context as `role` string.
     * You can check the origin of this in line #116 on {@link Abilities#define}
     *
     * @param {string|array} permissions - The name of the permission(s)
     * @param {string}       resource - (optional) The resource you are
     */
    var can = function(permissions, resource) {
        var bucket = [];
        var rolePermissions = roles[this];

        permissions = parseToArray(permissions, 'can');

        // dissolve aliases into 'real' permissions
        permissions.forEach(function(permission) {
            var aliasPermissions = aliases[permission];

            if (aliasPermissions) {
                bucket = bucket.concat(aliasPermissions);
            } else {
                bucket.push(permission);
            }
        });

        // iterates over real permissions adding each one to the role
        bucket.forEach(function(permission) {
            if (resource) {
                permission = [permission, resource].join('_');
            }

            if (rolePermissions.indexOf(permission) === -1) {
                rolePermissions.push(permission);
            }
        });
    };

    /**
     * Extends a role based on a role that was previously defined.
     * Usually used to avoid duplication of permissions.
     *
     * This is an internal function that will be called with the context as `role` string.
     * You can check the origin of this in line #116 on {@link Abilities#define}
     *
     * @param {string|array} existentRoles - The names of the role(s) you want to extend from
     */
    var extend = function(existentRoles) {
        var rolePermissions = roles[this];

        existentRoles = parseToArray(existentRoles, 'extend');

        existentRoles.forEach(function(existentRole) {
            var existentRolePermissions = roles[existentRole];

            if (!existentRolePermissions) {
                throw 'extend: role "' + existentRole + '" not defined to be extended';
            }

            existentRolePermissions.forEach(function(permission) {
                if (rolePermissions.indexOf(permission) === -1) {
                    rolePermissions.push(permission);
                }
            });
        });
    };

    var parseToArray = function(obj, method) {
        if (!Util.isString(obj) &&
            !Util.isArray(obj)) {
            throw method + ': expected "' + obj + '" to be an array or string';
        }

        // normalize plain string to array
        if (Util.isString(obj)) {
            obj = [obj];
        }

        return obj;
    };

    /**
     * [Abilities description]
     * @type {Object}
     */
    var Abilities = {
        /**
         * Creates an alias to permission(s).
         *
         * It's useful to avoid duplication of code especially when you are handling
         * CRUD applications.
         *
         * A built-in alias is defined as you can see in line #15 o this file. So,
         * if you want to use <code>can('manage', 'resource')</code> it will map that
         * to 'read_resource', 'edit_resource' and 'delete_resource'.
         *
         * @method alias
         * @param {string}       name - The name reference of the alias
         * @param {string|array} permissions - The name(s) of permission(s)
         */
        alias: function(name, permissions) {
            permissions = parseToArray(permissions);

            aliases[name] = permissions;
        },

        /**
         * Defines a role. This is the staring point of creating roles and associating
         * permissions to it.
         *
         * @method define
         * @param {string}   role - The name of the role
         * @param {Function} callback - The callback that will be called with {@link can} and
         *                               {@link can} as parameters
         * @return {Abilities} - The instance of the Abilities object
         */
        define: function(role, callback) {
            roles[role] = [];

            if (callback) {
                callback(can.bind(role), extend.bind(role));
            }

            return this;
        },

        /**
         * It clears all the roles previously defined.
         *
         * @method flush
         */
        flush: function() {
            roles = {};
        },

        /**
         * Returns the `roles` variable that it's an object that reflects a map of
         * roles and its permissions. With that you can now manage your role
         * based authorization system.
         *
         * @method toJSON
         * @return {object} - Roles map and it
         */
        toJSON: function() {
            return roles;
        }
    };

    if (typeof exports === 'object') {
        module.exports = Abilities;
    } else {
        root.Abilities = Abilities;
    }
}(this));
