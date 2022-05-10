import { findClosestByPath, getObjectsByPrototype } from "game/utils";
import { Creep, StructureSpawn } from "game/prototypes";
import { ATTACK, ERR_NOT_IN_RANGE, HEAL, RANGED_ATTACK } from "game/constants";
// import { updateArmyNetworth, updateEnemyArmyNetworth } from "./gamestate";

let myArmy: Creep[];
let enemyArmy: Creep[];
let enemySpawn: StructureSpawn;

export function armyManager() {
  const spawnPresent = getObjectsByPrototype(StructureSpawn).find(i => !i.my);
  if (!spawnPresent) return;

  enemySpawn = spawnPresent;
  enemyArmy = getObjectsByPrototype(Creep)
    .filter(creep => !creep.my)
    .filter(isWarrior);

  myArmy = getObjectsByPrototype(Creep)
    .filter(creep => creep.my)
    .filter(isWarrior);

  myArmy.forEach(warriorThings);
}

function warriorThings(warrior: Creep) {
  if (enemyArmy.length === 0) {
    if (warrior.rangedAttack(enemySpawn) === ERR_NOT_IN_RANGE) {
      warrior.moveTo(enemySpawn);
    }
  } else {
    const target = findClosestByPath(warrior, enemyArmy);
    if (warrior.rangedAttack(target) === ERR_NOT_IN_RANGE) {
      warrior.moveTo(target);
    }
  }
}

function isWarrior(creep: Creep): boolean {
  return creep.body.some(part => part.type === RANGED_ATTACK || part.type === ATTACK || part.type === HEAL);
}
