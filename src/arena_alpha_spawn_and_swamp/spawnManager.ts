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

  if (gameState.getWorkers().length < 3) {
    spawnCreep({ carry: 3, move: 1 }, "worker");
  } else {
    spawnCreep({ rangedAttack: 3, move: 2 }, "ranged_attacker");
  }
}

function spawnCreep({ move = 0, carry = 0, rangedAttack = 0 }, role: string) {
  const moves = Array.from(Array(move), () => MOVE);
  const carries = Array.from(Array(carry), () => CARRY);
  const rangedAttacks = Array.from(Array(rangedAttack), () => RANGED_ATTACK);

  const parts: BodyPartConstant[] = [...moves, ...carries, ...rangedAttacks];

  if (spawn.store.energy >= partsToCost(parts)) {
    const spawnResult = spawn.spawnCreep(parts);
    if (!spawnResult.object) return;
    const newCreep = spawnResult.object;
    newCreep.role = role;
  }
}
