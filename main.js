var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
};
var role_distribution = {
    harvester: 0.66666,
    upgrader:  0.33333,
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

    // Spawn creeps from full spawners
    for (var name in Game.spawns) {
        var spawner = Game.spawns[name];
        // skip spawners without enough energy
        if (spawner.energy < spawner.energyCapacity) continue;

        // compare the existing distribution to the target
        var dist = [];
        for (var role_name in role_counts) {
            var target = role_distribution[role_name] * num_creeps;
            dist.push([role_counts[role_name] - target, role_name]);
        }
        dist.sort();
        // first entry is the role we need most
        if (dist[0][0] < 0) {
            spawnCreep(dist[0][1], spawner);
        }
    }
}
