import { BodyPartConstant, CARRY, MOVE, RANGED_ATTACK } from "game/constants";
import { StructureSpawn } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";
import * as gameState from "./gameState";
import { partsToCost } from "./utils";

let spawn: StructureSpawn;

export function spawnManager() {
  const spawn1 = getObjectsByPrototype(StructureSpawn).find(it => it.my);
  if (!spawn1) return;
  spawn = spawn1;

  if (gameState.getWorkers().length < 4) {
    spawnCreep([MOVE, CARRY, CARRY, CARRY], "worker");
  } else {
    spawnCreep([MOVE, RANGED_ATTACK, RANGED_ATTACK], "ranged_attacker");
  }
}

function spawnCreep(parts: BodyPartConstant[], role: string) {
  if (spawn.store.energy >= partsToCost(parts)) {
    const spawnResult = spawn.spawnCreep(parts);
    if (!spawnResult.object) return;
    const newCreep = spawnResult.object;
    newCreep.role = role;
  }
}
