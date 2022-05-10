import { Creep } from "game/prototypes";
import { ATTACK, CARRY, HEAL, MOVE, RANGED_ATTACK, TOUGH, WORK } from "game/constants";

Creep.prototype.getCost = function (): number {
  const valueByType = (type: string): number => {
    switch (type) {
      case MOVE:
        return 50;
      case WORK:
        return 100;
      case CARRY:
        return 50;
      case ATTACK:
        return 80;
      case RANGED_ATTACK:
        return 150;
      case HEAL:
        return 250;
      case TOUGH:
        return 10;
      default:
        console.log(`unknown part ${type}`);
        return 0;
    }
  };

  return this.body
    .map(it => it.type)
    .map(type => valueByType(type))
    .reduce((partialSum, a) => partialSum + a, 0);
};
