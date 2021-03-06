import { Creep, StructureSpawn } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";

export class Observer {
  private spawns: readonly StructureSpawn[] | null = null;
  private friendlySpawns: readonly StructureSpawn[] | null = null;
  private enemySpawns: readonly StructureSpawn[] | null = null;
  private creeps: readonly Creep[] | null = null;
  private friendlyCreeps: readonly Creep[] | null = null;
  private enemyCreeps: readonly Creep[] | null = null;

  public clearData() {
    this.spawns = null;
    this.enemySpawns = null;
    this.friendlySpawns = null;
    this.creeps = null;
    this.friendlyCreeps = null;
    this.enemyCreeps = null;
  }

  public getSpawns(): readonly StructureSpawn[] {
    if (this.spawns === null) {
      this.spawns = getObjectsByPrototype(StructureSpawn);
    }
    return this.spawns;
  }

  public getFriendlySpawns(): readonly StructureSpawn[] {
    if (this.friendlySpawns === null) {
      this.friendlySpawns = this.getSpawns().filter(it => it.my);
    }
    return this.friendlySpawns;
  }

  public getEnemySpawns(): readonly StructureSpawn[] {
    if (this.enemySpawns === null) {
      this.enemySpawns = this.getSpawns().filter(it => !it.my);
    }
    return this.enemySpawns;
  }

  public getCreeps(): readonly Creep[] {
    if (this.creeps === null) {
      this.creeps = getObjectsByPrototype(Creep);
    }
    return this.creeps;
  }

  public getFriendlyCreeps(): readonly Creep[] {
    if (this.friendlyCreeps === null) {
      this.friendlyCreeps = this.getCreeps().filter(it => it.my);
    }
    return this.friendlyCreeps;
  }

  public getEnemyCreeps(): readonly Creep[] {
    if (this.enemyCreeps === null) {
      this.enemyCreeps = this.getCreeps().filter(it => !it.my);
    }
    return this.enemyCreeps;
  }

  public getFriendlyArmyValue(): number {
    return this.getFriendlyCreeps()
      .filter(it => it.isSoldier())
      .map(it => it.getCost())
      .reduce((acc, current) => acc + current, 0);
  }

  public getEnemyArmyValue(): number {
    return this.getEnemyCreeps()
      .filter(it => it.isSoldier())
      .map(it => it.getCost())
      .reduce((acc, current) => acc + current, 0);
  }

  public getAttackers(): readonly Creep[] {
    const enemySpawn = this.getEnemySpawns()[0];

    return this.getEnemyCreeps()
      .filter(it => it.isSoldier())
      .filter(it => it.getRangeTo(enemySpawn) > 20);
  }
}
