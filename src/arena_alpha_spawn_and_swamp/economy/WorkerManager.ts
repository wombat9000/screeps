import { ERR_NOT_IN_RANGE, RESOURCE_ENERGY } from "game/constants";
import { Creep, StructureContainer, StructureSpawn } from "game/prototypes";
import { findClosestByPath, findInRange, getObjectsByPrototype } from "game/utils";
import * as gameState from "../gameState";
import "../creepFunctions";
import { Observer } from "../Observer";

export class WorkerManager {
  private observer: Observer;
  private harvestableContainers: StructureContainer[] = [];

  public constructor(observer: Observer) {
    this.observer = observer;
  }

  public loop() {
    this.harvestableContainers = getObjectsByPrototype(StructureContainer).filter(it => it.store.energy > 0);

    const myWorkers = this.observer.getFriendlyCreeps().filter(creep => creep.role === "worker");

    gameState.setWorkers(myWorkers);
    myWorkers.forEach(it => this.doWork(it));
  }

  private doWork(worker: Creep) {
    const capacity = worker.store.getFreeCapacity(RESOURCE_ENERGY);
    if (capacity === null || !worker.exists) return;
    if (capacity > 0) {
      const safeContainers = findInRange(worker, this.harvestableContainers, 10);
      const container = findClosestByPath(worker, safeContainers);
      if (safeContainers.length > 0) {
        harvest(worker, container);
      }
    } else {
      const spawn = getObjectsByPrototype(StructureSpawn).find(it => it.my);
      if (!spawn) return;
      if (worker.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        worker.moveTo(spawn);
        // const path = searchPath(worker, spawn).path;
        // new Visual().poly(path);
      }
    }
  }
}

function harvest(worker: Creep, container: StructureContainer) {
  if (worker.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    // const path = searchPath(worker, container).path;
    // new Visual().poly(path);
    worker.moveTo(container);
  }
}
