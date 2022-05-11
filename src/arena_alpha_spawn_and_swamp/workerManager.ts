import { CARRY, ERR_NOT_IN_RANGE, RESOURCE_ENERGY } from "game/constants";
import { Creep, StructureContainer, StructureSpawn } from "game/prototypes";
import { findClosestByPath, findInRange, getObjectsByPrototype } from "game/utils";
import { searchPath } from "game/path-finder";
import { Visual } from "game/visual";
import * as gameState from "./gameState";
import "./creepFunctions";
import { Observer } from "./Observer";

let harvestableContainers: StructureContainer[];

export class WorkerManager {
  private observer: Observer;

  public constructor(observer: Observer) {
    this.observer = observer;
  }

  public loop() {
    harvestableContainers = getObjectsByPrototype(StructureContainer).filter(it => it.store.energy > 0);

    const myWorkers = this.observer.getFriendlyCreeps().filter(creep => creep.role === "worker");

    gameState.setWorkers(myWorkers);
    myWorkers.forEach(doWork);
  }
}

function doWork(worker: Creep) {
  const capacity = worker.store.getFreeCapacity(RESOURCE_ENERGY);
  if (capacity === null) return;
  if (capacity > 0) {
    const safeContainers = findInRange(worker, harvestableContainers, 10);
    const container = findClosestByPath(worker, safeContainers);
    if (safeContainers.length > 0) {
      harvest(worker, container);
    }
  } else {
    const spawn = getObjectsByPrototype(StructureSpawn).find(it => it.my);
    if (!spawn) return;
    if (worker.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      worker.moveTo(spawn);
      const path = searchPath(worker, spawn).path;
      new Visual().poly(path);
    }
  }
}

function harvest(worker: Creep, container: StructureContainer) {
  if (worker.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    const path = searchPath(worker, container).path;
    new Visual().poly(path);
    worker.moveTo(container);
  }
}
