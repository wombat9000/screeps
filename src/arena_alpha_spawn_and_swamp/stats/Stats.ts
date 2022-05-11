import { Observer } from "../Observer";
import { Visual } from "game/visual";

export class Stats {
  private observer: Observer;

  public constructor(observer: Observer) {
    this.observer = observer;
  }

  public update() {
    // const spawns = this.observer.getSpawns();
    const friendlySoldiers = this.observer.getFriendlyCreeps().filter(it => it.isSoldier());
    const enemySoldiers = this.observer.getEnemyCreeps().filter(it => it.isSoldier());
    const networth = friendlySoldiers.map(it => it.getCost()).reduce((partialSum, a) => partialSum + a, 0);
    const enemyNetworth = enemySoldiers.map(it => it.getCost()).reduce((partialSum, a) => partialSum + a, 0);

    // TODO: total resources gathered
    // TODO: income/10ticks

    const friendlyStyle: TextStyle = {
      font: "1",
      align: "left",
      color: "#12ADB9",
      backgroundColor: "#085056"
    };

    const enemyStyle: TextStyle = {
      font: "1",
      align: "left",
      color: "#a80606",
      backgroundColor: "#560818"
    };
    new Visual().text(`Creeps: ${friendlySoldiers.length}`, { x: 0, y: 0 }, friendlyStyle);
    new Visual().text(`Army Value: ${networth}`, { x: 0, y: 1.5 }, friendlyStyle);
    new Visual().text(`${enemyNetworth}`, { x: 10, y: 1.5 }, enemyStyle);
    // new Visual().text(`Spawns: ${spawns.length}`, { x: 0, y: 3 }, friendlyStyle);
  }
}
