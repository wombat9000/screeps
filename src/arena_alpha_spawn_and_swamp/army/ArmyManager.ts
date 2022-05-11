import { findClosestByPath } from "game/utils";
import { Creep } from "game/prototypes";
import { ERR_NOT_IN_RANGE } from "game/constants";
import { Observer } from "../Observer";

export class ArmyManager {
  private myArmy: Creep[] = [];
  private enemyArmy: Creep[] = [];
  private observer: Observer;

  public constructor(observer: Observer) {
    this.observer = observer;
  }

  public loop() {
    this.enemyArmy = this.observer.getEnemyCreeps().filter(creep => creep.isSoldier());
    this.myArmy = this.observer.getFriendlyCreeps().filter(creep => creep.isSoldier());

    this.myArmy.forEach(creep => this.controlWarrior(creep));
  }

  private controlWarrior(warrior: Creep) {
    if (this.enemyArmy.length === 0) {
      const enemySpawn = this.observer.getEnemySpawns()[0];
      if (enemySpawn && warrior.rangedAttack(enemySpawn) === ERR_NOT_IN_RANGE) {
        warrior.moveTo(enemySpawn);
      }
    } else {
      const target = findClosestByPath(warrior, this.enemyArmy);
      if (warrior.rangedAttack(target) === ERR_NOT_IN_RANGE) {
        warrior.moveTo(target);
      }
    }
  }
}
