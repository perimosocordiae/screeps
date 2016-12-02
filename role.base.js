
function xfer_filter(s) {
    return (s.energy < s.energyCapacity) && (
        s.structureType == STRUCTURE_EXTENSION ||
        s.structureType == STRUCTURE_SPAWN);
}

module.exports = {
    harvest: function(creep) {
        // find a source and feed off it
        var source = creep.room.find(FIND_SOURCES)[0];
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
        // done if we're full of energy
        return creep.carry.energy >= creep.carryCapacity;
    },
    upgrade: function(creep) {
        // upgrade the controller
        var ctrl = creep.room.controller;
        if (creep.upgradeController(ctrl) == ERR_NOT_IN_RANGE) {
            creep.moveTo(ctrl);
        }
        // done if we're out of energy
        return creep.carry.energy <= 0;
    },
    transfer: function(creep) {
        // find a target structure
        var target = creep.room.find(FIND_STRUCTURES, {filter: xfer_filter})[0];
        if (target === undefined) return true;  // no targets -> done
        // move energy to it
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        // done if the target is full or if we're out of energy
        return (target.energy >= target.energyCapacity ||
                creep.carry.energy <= 0);
    },
    build: function(creep) {
        // find a target site
        var target = creep.room.find(FIND_CONSTRUCTION_SITES)[0];
        if (target === undefined) return true;  // no targets -> done
        // build it
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        // done if the target is finished or if we're out of energy
        return (target.progress >= target.progressTotal ||
                creep.carry.energy <= 0);
    }
};
