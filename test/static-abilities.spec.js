describe('Abilities', function() {
    var alias,
        define;

    beforeEach(function() {
        define = Abilities.define.bind(Abilities);
        alias = Abilities.alias.bind(Abilities);
        Abilities.flush();
    });

    describe('define()', function() {
        it('should create a role to the existent roles', function() {
            var role = 'role';

            define(role);

            expect(Abilities.toJSON()[role]).toBeDefined();
            expect(Abilities.toJSON()[role].length).toBe(0);
        });

        it('should override an existent role if it already exists', function() {
            var role = 'role';

            define(role, function(can) {
                can('read');
            });

            expect(Abilities.toJSON()[role].length).toBe(1);

            define(role);

            expect(Abilities.toJSON()[role].length).toBe(0);
        });

        it('should return the Abilities instance', function() {
            expect(define('role')).toBe(Abilities);
        });

        // FIXME find a way to improve this test
        it('should inject "can" and "extend" to the callback function', function() {
            define('role', function(can, extend) {
                expect(can).toBeDefined();
                expect(extend).toBeDefined();
            });
        });
    });

    describe('can()', function() {
        describe('single permission', function() {
            it('should add a permission to a role', function() {
                define('role', function(can) {
                    can('permission1');
                    can('permission2');
                });

                expect(Abilities.toJSON()).toEqual({
                    role: ['permission1', 'permission2']
                });
            });

            it('should add a permission to a role (with resource)', function() {
                define('role', function(can) {
                    can('permission1', 'resource1');
                    can('permission2', 'resource2');
                });

                expect(Abilities.toJSON()).toEqual({
                    role: ['permission1_resource1', 'permission2_resource2']
                });
            });
        });

        describe('multiple permissions', function() {
            it('should add a permission to a role', function() {
                define('role', function(can) {
                    can(['permission1', 'permission2']);
                });

                expect(Abilities.toJSON()).toEqual({
                    role: ['permission1', 'permission2']
                });
            });

            it('should add a permission to a role (with resource)', function() {
                define('role', function(can) {
                    can(['permission1', 'permission2'], 'resource');
                });

                expect(Abilities.toJSON()).toEqual({
                    role: ['permission1_resource', 'permission2_resource']
                });
            });
        });

        describe('permission with alias', function() {
            it('should add a permission to a role', function() {
                define('role', function(can) {
                    can(['permission1', 'manage'], 'resource');
                    can('manage', 'resource2');
                });

                expect(Abilities.toJSON()).toEqual({
                    role: ['permission1_resource', 'read_resource', 'edit_resource', 'delete_resource', 'read_resource2', 'edit_resource2', 'delete_resource2']
                });
            });
        });

        it('should throw exception if first parameter is not a string nor an array', function() {
            var can1 = function() {
                define('role', function(can) {
                    can(123, 'resource');
                });
            };

            var can2 = function() {
                define('role', function(can) {
                    can({}, 'resource');
                });
            };

            expect(can1).toThrow();
            expect(can2).toThrow();
        });
    });

    describe('alias()', function() {
        it('should add alias to real permissions (array)', function() {
            alias('crud', ['create', 'read', 'update', 'delete']);

            define('role', function(can) {
                can(['crud'], 'resource');
            });

            expect(Abilities.toJSON()).toEqual({
                role: ['create_resource', 'read_resource', 'update_resource', 'delete_resource']
            });
        });

        it('should add alias to real permissions (string)', function() {
            alias('update', ['edit']);

            define('role', function(can) {
                can(['update'], 'resource');
            });

            expect(Abilities.toJSON()).toEqual({
                role: ['edit_resource']
            });
        });

        it('should throw exception if second parameter is not a string nor an array', function() {
            var alias1 = function() {
                alias('crud', 123);
            };

            var alias2 = function() {
                alias('edit', {});
            };

            expect(alias1).toThrow();
            expect(alias2).toThrow();
        });
    });

    describe('extend()', function() {
        it('should append the role`s permissions to the one defined (single)', function() {
            var roles;

            define('role1', function(can) {
                can('permission1');
            });

            define('role2', function(can, extend) {
                extend('role1');

                can('permission2');
            });

            roles = Abilities.toJSON();

            expect(roles.role2).toEqual(['permission1', 'permission2']);
        });

        it('should append the role`s permissions to the one defined (array)', function() {
            var roles;

            define('role1', function(can) {
                can('permission1');
            });

            define('role2', function(can, extend) {
                can('permission2');
            });

            define('role3', function(can, extend) {
                extend(['role1', 'role2']);
            });

            roles = Abilities.toJSON();

            expect(roles.role3).toEqual(['permission1', 'permission2']);
        });

        it('should not duplicate permissions when existent roles conflicts', function() {
            var roles;

            define('role1', function(can) {
                can('permission1');
            });

            define('role2', function(can, extend) {
                can('permission1');
            });

            define('role3', function(can, extend) {
                extend(['role1', 'role2']);
            });

            roles = Abilities.toJSON();

            expect(roles.role3).toEqual(['permission1']);
        });

        it('should throw an error if role supposed to be extended does not exist', function() {
            var extend = function() {
                define('role1', function(can, extend) {
                    extend('role');
                });
            };

            expect(extend).toThrow();
        });
    });

    describe('toJSON()', function() {
        it('should return an object with all the roles and permissions', function() {
            define('role1', function(can) {
                can('permission1');
            });

            define('role2', function(can, extend) {
                extend('role1');

                can('permission2');
            });

            expect(Abilities.toJSON()).toEqual({
                role1: [ 'permission1' ],
                role2: [ 'permission1', 'permission2' ]
            });
        });
    });
});
