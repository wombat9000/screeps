import { findClosestByPath, getRange, getTicks } from "game/utils";
import { Creep, GameObject, RoomPosition } from "game/prototypes";
import { ERR_NOT_IN_RANGE } from "game/constants";
import { Observer } from "../Observer";
import { Visual } from "game/visual";
import _ from "lodash";

const RALLY_POINT_COLOR = "#88137b";
const ENEMY_RECT_COLOR = "#5b0000";

export class ArmyManager {
  private myArmy: readonly Creep[] = [];
  private enemyArmy: Creep[] = [];
  private injuredWarriors: Creep[] = [];
  private observer: Observer;
  private globalStrategy: "attack" | "defend" = "defend";
  private rallyPoint: { x: number; y: number } = { x: 50, y: 15 };

  public constructor(observer: Observer) {
    this.observer = observer;
  }

  public loop() {
    this.enemyArmy = this.observer.getEnemyCreeps().filter(it => it.isSoldier());
    this.myArmy = this.observer.getFriendlyCreeps().filter(it => it.isSoldier());

    this.injuredWarriors = this.myArmy.filter(it => it.hits < it.hitsMax);

    const networthAdvantage = this.observer.getFriendlyArmyValue() - this.observer.getEnemyArmyValue();
    if (networthAdvantage >= 1000 || getTicks() > 1000) {
      this.globalStrategy = "attack";
    } else {
      this.globalStrategy = "defend";
    }

    // TODO: stance-check
    this.myArmy.forEach(creep => this.controlWarrior(creep));

    new Visual().rect(this.rallyPoint, 1, 1, { fill: RALLY_POINT_COLOR });

    this.drawZone(this.enemyArmy, ENEMY_RECT_COLOR);
  }

  private drawZone(objects: GameObject[], color: string) {
    const getOrZero = (num: number | undefined): number => (num ? num : 0);
    const minX = _.minBy(objects, it => it.x)?.x;
    const maxX = _.maxBy(objects, it => it.x)?.x;

    const minY = _.minBy(objects, it => it.y)?.y;
    const maxY = _.maxBy(objects, it => it.y)?.y;

    const origin = { x: getOrZero(minX), y: getOrZero(minY) };
    const xDiff = getOrZero(maxX) - getOrZero(minX);
    const yDiff = getOrZero(maxY) - getOrZero(minY);
    new Visual().rect(origin, xDiff, yDiff, { fill: color });
  }

  private controlWarrior(warrior: Creep) {
    switch (this.globalStrategy) {
      case "defend": {
        this.defend(warrior);
        break;
      }
      case "attack": {
        this.attackBase(warrior);
        break;
      }
    }
  }

  private defend(warrior: Creep) {
    // todo: determine when to use ranged mass attack

    const target = findClosestByPath(warrior, this.enemyArmy);

    if (getRange(warrior, target) === 1) {
      console.log(`ArmyManager: Creep ${warrior.id} under attack.`);
      this.retreatFrom(warrior, target);
      return;
    }

    if (warrior.rangedAttack(target) === ERR_NOT_IN_RANGE) {
      warrior.moveTo(this.rallyPoint);
    }

    const healTarget = findClosestByPath(warrior, this.injuredWarriors);
    if (healTarget) {
      warrior.heal(healTarget);
    }
  }

  private retreatFrom(warrior: Creep, position: RoomPosition) {
    const vector = this.getVector(warrior, position);
    console.log(`vector: ${vector.xDiff} ${vector.yDiff}`);

    const target = { x: warrior.x + vector.xDiff * 5, y: warrior.y + vector.yDiff * 5 };
    warrior.moveTo(target);
  }

  private getVector(position: RoomPosition, otherPosition: RoomPosition): { xDiff: number; yDiff: number } {
    const xDiff = position.x - otherPosition.x;
    const yDiff = position.y - otherPosition.y;

    return { xDiff, yDiff };
  }

  private attackBase(warrior: Creep) {
    if (this.enemyArmy.length === 0) {
      const enemySpawn = this.observer.getEnemySpawns()[0];
      if (enemySpawn && warrior.rangedAttack(enemySpawn) === ERR_NOT_IN_RANGE) {
        warrior.moveTo(enemySpawn);
      }
    } else {
      // const isInjured = warrior.hits < warrior.hitsMax;
      const target = findClosestByPath(warrior, this.enemyArmy);

      if (getRange(warrior, target) === 1) {
        console.log(`ArmyManager: Creep ${warrior.id} under attack.`);
        this.retreatFrom(warrior, target);
      }

      const healTarget = findClosestByPath(warrior, this.injuredWarriors);
      if (healTarget) {
        warrior.heal(healTarget);
      }

      if (warrior.rangedAttack(target) === ERR_NOT_IN_RANGE) {
        warrior.moveTo(target);
      }
    }
  }
}
