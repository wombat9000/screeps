import { findClosestByPath } from "game/utils";
import { Creep, GameObject } from "game/prototypes";
import { ERR_NOT_IN_RANGE } from "game/constants";
import { Observer } from "../Observer";
import { Visual } from "game/visual";
import _ from "lodash";

const RALLY_POINT_COLOR = "#88137b";
const ENEMY_RECT_COLOR = "#5b0000";

export class ArmyManager {
  private myArmy: readonly Creep[] = [];
  private enemyArmy: Creep[] = [];
  private injuredWarriors: readonly Creep[] = [];
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
    const target = findClosestByPath(warrior, this.enemyArmy);
    if (warrior.rangedAttack(target) === ERR_NOT_IN_RANGE) {
      warrior.moveTo(this.rallyPoint);
    }
  }

  private attackBase(warrior: Creep) {
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
