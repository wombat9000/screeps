declare module "game" {
  export type BodyPartConstant = MOVE | WORK | CARRY | ATTACK | RANGED_ATTACK | TOUGH | HEAL | CLAIM;

  export type MOVE = "move";
  export type WORK = "work";
  export type CARRY = "carry";
  export type ATTACK = "attack";
  export type RANGED_ATTACK = "ranged_attack";
  export type TOUGH = "tough";
  export type HEAL = "heal";
  export type CLAIM = "claim";

  export const MOVE: MOVE;
  export const WORK: WORK;
  export const CARRY: CARRY;
  export const ATTACK: ATTACK;
  export const RANGED_ATTACK: RANGED_ATTACK;
  export const TOUGH: TOUGH;
  export const HEAL: HEAL;
  export const CLAIM: CLAIM;

  export type DirectionConstant = TOP | TOP_RIGHT | RIGHT | BOTTOM_RIGHT | BOTTOM | BOTTOM_LEFT | LEFT | TOP_LEFT;

  export type TOP = 1;
  export type TOP_RIGHT = 2;
  export type RIGHT = 3;
  export type BOTTOM_RIGHT = 4;
  export type BOTTOM = 5;
  export type BOTTOM_LEFT = 6;
  export type LEFT = 7;
  export type TOP_LEFT = 8;

  export const TOP: TOP;
  export const TOP_RIGHT: TOP_RIGHT;
  export const RIGHT: RIGHT;
  export const BOTTOM_RIGHT: BOTTOM_RIGHT;
  export const BOTTOM: BOTTOM;
  export const BOTTOM_LEFT: BOTTOM_LEFT;
  export const LEFT: LEFT;
  export const TOP_LEFT: TOP_LEFT;

  export * from "game/utils";
  export * from "game/path-finder";

  // prototypes/prototypes.d.ts
  export interface _Constructor<T> {
    readonly prototype: T;
  }

  export interface RoomPosition {
    /**
     * X position in the room.
     */
    x: number;
    /**
     * Y position in the room.
     */
    y: number;
  }

  // prototypes/room-objects.d.ts
  export interface RoomObject extends RoomPosition {
    // constructor(id: any);
    /**
     * Returns true if this object is live in the game at the moment. Check this property to verify cached or newly created object instances.
     */
    exists: boolean;
    x: any;
    y: any;
    /**
     * Returns the path from this object to another position. pos can be any object containing x and y properties. See /game/utils::findPath for details.
     * @param pos
     * @param opts
     */
    findPathTo(pos: any, opts: any): any;
    toJSON(): {
      id: any;
      x: any;
      y: any;
    };
  }

  // prototypes/creep.d.ts
  export interface Creep extends RoomObject {
    readonly prototype: Creep;
    /**
     * The current amount of hit points of the creep.
     */
    hits: number;
    /**
     * The maximum amount of hit points of the creep.
     */
    hitsMax: number;
    /**
     * Whether it is your creep.
     */
    my: boolean;
    /**
     * Fatigue indicator of the creep. It can move only when fatigue equals to 0.
     */
    fatigue: number;
    /**
     * An array describing the creep’s body. Each element contains the following properties:
     *     type: string (One of the body part types constants)
     *     hits: number (The remaining amount of hit points of this body part)
     */
    body: { type: BodyPartConstant; hits: number }[];
    /**
     * Move the creep one square in the specified direction. direction must be one of the following constants:
     * @param direction
     */
    move(direction: DirectionConstant): any;
    /**
     * Find the optimal path to the target within the same room and move to it.
     * A shorthand to consequent calls of findPathTo() and move() methods.
     * @param target target can be any object containing x and y properties.
     * @param opts opts is an optional object containing additional options. See /game/utils::findPath for details.
     */
    moveTo(target: RoomPosition, opts?: any): any;
    /**
     * A ranged attack against another creep or structure. Requires the RANGED_ATTACK body part.
     * The target has to be within 3 squares range of the creep.
     * @param target
     */
    rangedAttack(target: any): any;
    /**
     * A ranged attack against all hostile creeps or structures within 3 squares range.
     * Requires the RANGED_ATTACK body part.
     * The attack power depends on the range of each target.
     * Friendly units are not affected.
     */
    rangedMassAttack(): any;
    /**
     * Attack another creep or structure in a short-ranged attack.
     * Requires the ATTACK body part.
     * The target has to be at an adjacent square to the creep.
     * @param target
     */
    attack(target: any): any;
    /**
     * Heal self or another creep.
     * It will restore the target creep’s damaged body parts function and increase the hits counter.
     * Requires the HEAL body part.
     * The target has to be at an adjacent square to the creep.
     * @param target
     */
    heal(target: any): any;
    /**
     * Heal another creep at a distance.
     * It will restore the target creep’s damaged body parts function and increase the hits counter.
     * Requires the HEAL body part.
     * The target has to be within 3 squares range of the creep.
     * @param target
     */
    rangedHeal(target: any): any;
    pull(target: any): any;
  }

  //   interface CreepConstructor extends _Constructor<Creep> {}
  // const Creep: CreepConstructor;
  export const Creep: Creep;

  // prototypes/tower.d.ts
  export interface StructureTower extends RoomObject {
    /**
     * The current amount of hit points of the tower.
     */
    hits: number;
    /**
     * The maximum amount of hit points of the tower.
     */
    hitsMax: number;
    /**
     * Returns true for your tower, false for a hostile tower, undefined for a neutral tower.
     */
    my: boolean;
    /**
     * An object that contains a cargo of this structure. Towers can contain only energy.
     */
    store: {
      energy: any;
      getCapacity(): any;
    };
    /**
     * Remotely attack any creep or structure.
     * The target has to be within 50 squares range of the tower.
     * @param target
     */
    attack(target: any): any;
    /**
     * Remotely heal any creep.
     * The target has to be within 50 squares range of the tower.
     * @param target
     */
    heal(target: any): any;
  }
  // interface StructureTowerConstructor extends _Constructor<StructureTower>, _ConstructorById<StructureTower> {}

  // const StructureTower: StructureTowerConstructor;
  export const StructureTower: StructureTower;

  // prototypes/wall.d.ts
  export interface StructureWall extends RoomObject {
    /**
     * The current amount of hit points of the wall.
     */
    hits: number;
    /**
     * The maximum amount of hit points of the wall.
     */
    hitsMax: number;
  }
  export const StructureWall: StructureWall;

  // utils.d.ts
  /**
   * Get count of game ticks passed since the start of the game
   */
  // function getTime(): number;
  // function getObjectById(id: any): any;
  // function getObjects(): any;
  // function getObjectsByPrototype(prototype: any): any;
  // function getHeapStatistics(): any;
  // function getDirection(dx: any, dy: any): any;

  // // eslint-disable-next-line @typescript-eslint/ban-types
  // function findPath(fromPos: any, toPos: any, opts?: {}): any;
  // function getDistance(a: any, b: any): number;

  // path-finder.d.ts
  // TODO: type this
  // function searchPath(origin: any, goal: any, options: any): any;

  // TODO: type this
  export interface CostMatrix {
    deserialize(data: any): any;
    _bits: Uint8Array;
    set(xx: any, yy: any, val: any): void;
    get(xx: any, yy: any): number;
    clone(): CostMatrix;
    serialize(): any;
  }

  // constants
  export const CARRY_CAPACITY: 50;

  export const ERR_BUSY: -4;
  export const ERR_FULL: -8;
  export const ERR_INVALID_ARGS: -10;
  export const ERR_INVALID_TARGET: -7;
  export const ERR_NAME_EXISTS: -3;
  export const ERR_NOT_ENOUGH_ENERGY: -6;
  export const ERR_NOT_ENOUGH_EXTENSIONS: -6;
  export const ERR_NOT_ENOUGH_RESOURCES: -6;
  export const ERR_NOT_FOUND: -5;
  export const ERR_NOT_IN_RANGE: -9;
  export const ERR_NOT_OWNER: -1;
  export const ERR_NO_BODYPART: -12;
  export const ERR_NO_PATH: -2;
  export const ERR_TIRED: -11;
  export const OK: 0;

  export const HEAL_POWER: 12;
  export const OBSTACLE_OBJECT_TYPES: any;
  export const tower: any;
  export const constructedWall: any;
  export const RANGED_ATTACK_DISTANCE_RATE: any[];
  export const RANGED_ATTACK_POWER: 10;
  export const RANGED_HEAL_POWER: 4;
  export const ROAD_WEAROUT: 1;

  export const TERRAIN_MASK_SWAMP: 2;
  export const TERRAIN_MASK_WALL: 1;
  export const TOWER_CAPACITY: 1000;
  export const TOWER_ENERGY_COST: 10;
  export const TOWER_FALLOFF: 0.75;
  export const TOWER_FALLOFF_RANGE: 20;
  export const TOWER_HITS: 3000;
  export const TOWER_OPTIMAL_RANGE: 5;
  export const TOWER_POWER_ATTACK: 600;
  export const TOWER_POWER_HEAL: 400;
  export const TOWER_POWER_REPAIR: 800;
  export const TOWER_RANGE: 50;
}