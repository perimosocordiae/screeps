var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
};
var role_targets = {
    harvester: 2,
    upgrader: 1,
}

function spawnCreep(role_name, spawn) {
    var name = spawn.createCreep([WORK,CARRY,MOVE], null, {role: role_name});
    if (!Number.isInteger(name)) {
        console.log('Spawned new', role_name + ':', name);
    }
}

module.exports.loop = function () {
    // Clear dead creep memory
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Cleared non-existing creep memory:', name);
        }
    }

    // Run and count live creeps
    var role_counts = {harvester: 0, upgrader: 0};
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        role_counts[creep.memory.role] += 1;
        var role = roles[creep.memory.role];
        if (role !== undefined) {
            role.run(creep);
        }
    }

    // Spawn creeps up to the target count per role
    for (var role_name in role_counts) {
        if (role_counts[role_name] < role_targets[role_name]) {
            spawnCreep(role_name, Game.spawns['Spawn1']);
        }
    }

}
