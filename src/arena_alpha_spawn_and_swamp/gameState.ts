import { Creep } from "game/prototypes";
const gameState: {
  workers: Creep[];
} = {
  workers: []
};

export function getWorkers(): Creep[] {
  return [...gameState.workers];
}

export function setWorkers(workers: Creep[]) {
  gameState.workers = workers;
}
