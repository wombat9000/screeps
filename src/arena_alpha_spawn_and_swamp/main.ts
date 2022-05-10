import { ArmyManager } from "./army/ArmyManager";
import { spawnManager } from "./spawnManager";
import { workerManager } from "./workerManager";
import { isFirstTick } from "../common";

declare module "game/prototypes" {
  interface Creep {
    role: string;

    getCost(): number;
  }
}

let armyManager: ArmyManager;

export function loop(): void {
  if (isFirstTick()) {
    bootstrap();
  }
  spawnManager();
  workerManager();
  armyManager.loop();
}

function bootstrap() {
  armyManager = new ArmyManager();
}
