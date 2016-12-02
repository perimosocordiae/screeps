var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
};
var role_distribution = {
    harvester: 0.33333,
    upgrader:  0.99999,
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
    var num_creeps = 0;
    var role_counts = {harvester: 0, upgrader: 0};
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        role_counts[creep.memory.role]++;
        num_creeps++;
        var role = roles[creep.memory.role];
        if (role !== undefined) {
            role.run(creep);
        }
    }

    // Spawn creeps if we're full, following the target distribution
    var spawner = Game.spawns['Spawn1'];
    if (spawner.energy >= spawner.energyCapacity) {
        for (var role_name in role_counts) {
            var target = role_distribution[role_name] * num_creeps;
            if (role_counts[role_name] < target) {
                spawnCreep(role_name, spawner);
            }
        }
    }

}
