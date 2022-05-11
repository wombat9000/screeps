import { ArmyManager } from "./army/ArmyManager";
import { spawnManager } from "./spawnManager";
import { WorkerManager } from "./workerManager";
import { isFirstTick } from "../common";
import { Observer } from "./Observer";

declare module "game/prototypes" {
  interface Creep {
    role: string;

    getCost(): number;
  }
}

let armyManager: ArmyManager;
let observer: Observer;
// let stats: Stats;
let workerManager: WorkerManager;

export function loop(): void {
  if (isFirstTick()) {
    bootstrap();
  }
  observer.clearData();
  spawnManager();
  workerManager.loop();
  armyManager.loop();
  // stats.update();
}

function bootstrap() {
  console.log("Main: Performing first tick setup.");
  observer = new Observer();
  armyManager = new ArmyManager(observer);
  // stats = new Stats(observer);
  workerManager = new WorkerManager(observer);
}
