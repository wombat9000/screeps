import { armyManager } from "./army/armyManager";
import { spawnManager } from "./spawnManager";
import { workerManager } from "./workerManager";

declare module "game/prototypes" {
  interface Creep {
    role: string;
    getCost(): number;
  }
}

export function loop(): void {
  spawnManager();
  workerManager();
  armyManager();
}
