module.exports = function(schema, options) {
    options || (options = {});

    if (!options.key) {
        options.key = function() {
            return 'subject:' + this._id;
        };
    }

    if (!options.additionalKeys) {
        options.additionalKeys = function() {
            return [];
        };
    }

    // Methods

    schema.methods.getAccessKeys = function() {
        var key = options.key.call(this);
        var additional = options.additionalKeys.call(this);
        var keys = [key, options.public].concat(additional);

        return keys.filter(function(key) {
            return !!key;
        });
    };

    schema.methods.getAccess = function(object) {
        var entries = this.getAccessKeys().map(function(key) {
            return object.getAccess(key);
        });

        var result = [];

        entries.forEach(function(perms) {
            var permsArray = [];
            if ('object' === typeof perms) {
              for (var i in perms) {
                perms[i] && permsArray.push(i);
              }
              this.setAccess(object, permsArray);
            } else { 
              permsArray = perms;
            }
            perms.forEach(function(perm) {
                if (result.indexOf(perm) === -1) {
                    result.push(perm);
                }
            });
        });

        return result;
    };

    schema.methods.setAccess = function(object, perms) {
        var key = options.key.call(this);
        object.setAccess(key, perms);
    };
};
