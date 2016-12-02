var methods = require('role.base');

module.exports = {
    run: function(creep) {
        if (creep.memory.working) {
            creep.memory.working = !methods.upgrade(creep);
        } else {
            creep.memory.working = methods.harvest(creep);
        }
    }
};
