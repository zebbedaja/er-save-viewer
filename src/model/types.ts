import type { Save } from '@zebbedaja/er-save-parser'

export interface Encounter {
  flagId: number
  flagName: string
  hp: number
  runes: number
  region: string
  location: string
  closestSiteOfGrace: string
  type: string
  drops: string[]
  nightOnly: boolean
  dlc: boolean
  npcs: Npc[]
}

export interface ResistanceValue {
  immune: boolean
  thresholds: number[]
}

export interface Negation {
  standard: number
  strike: number
  slash: number
  pierce: number
  magic: number
  fire: number
  lightning: number
  holy: number
}

export interface Resistance {
  poison: ResistanceValue
  scarletRot: ResistanceValue
  bloodLoss: ResistanceValue
  frostBite: ResistanceValue
  madness: ResistanceValue
  sleep: ResistanceValue
  deathBlight: ResistanceValue
}

export interface Poise {
  base: number
  absorption: number
  effective?: number
  regenDelay: number
}

export interface Defense {
  physical: number
  magic: number
  fire: number
  lightning: number
  holy: number
}

export interface Npc {
  id: number
  entityId: string
  think?: number
  talk?: number
  flagId: number
  name: string
  phase: number
  level: number
  spEffectID: number
  stanceCritical: boolean
  backstab: boolean
  parryable: boolean
  hp: number
  defense: Defense
  inflictedDamageTypes?: string[]
  inflictedStatusEffects?: string[]
  weakPartsDamageRate: number
  weakPart?: string
  numberOfParries: number
  void: boolean
  thoseWhoLiveInDeath: boolean
  ancientDragon: boolean
  dragon: boolean
  undead: boolean
  human: boolean
  negation: Negation
  resistance: Resistance
  poise: Poise
  stats: Stats
  armor: Armor
}

export interface ProcessedEncounter extends Encounter {
  level: number | null
  hasGreatRune: boolean
  hasRemembrance: boolean
  hasParryable: boolean
  hasHuman: boolean
  hasDuoPhase: boolean
  hasMultiplePhases: boolean
  hasVoid: boolean
  hasDragon: boolean
  hasAncientDragon: boolean
  hasUndead: boolean
  hasThoseWhoLiveInDeath: boolean
  hasBackstab: boolean
}

export interface Region {
  name: string
  scaling: number
}

export interface HistoryEntry {
  data: Save
  timestamp: number
  lastModified: number
}

export interface Stats {
  runeLevel?: number
  vigor?: number
  mind?: number
  endurance?: number
  strength?: number
  dexterity?: number
  intelligence?: number
  faith?: number
  arcane?: number
}

export interface Armor {
  helm?: string
  chestArmor?: string
  gauntlets?: string
  legArmor?: string
}

export interface Section {
  id: string
  labelKey: string
  keyPrefix: string
  bosses: [string, ProcessedEncounter[]][]
  defeated: number
  total: number
  flatBosses: ProcessedEncounter[]
}

export interface YouTubeVideo {
  flagId: number
  youTubeId: string
  youTubeTitle: string
  youTubeUser: string
}

export interface MapLocation {
  id: number
  name: string
  locationType: LocationType
  mapType: MapType
  lngLat?: [number, number]
  dungeonType?: DungeonType
}

export interface World {
  name: string
  map: MapType
  tiles: string
  width: number
  height: number
}

export interface MapOverlay {
  name: string
  image: string
  type: DungeonType
  mapType: MapType
  width: number
  rotation: number
  lng: number
  lat: number
  debug?: boolean
}

export enum MapType {
  LANDS_BETWEEN,
  UNDERGROUND,
  LAND_OF_SHADOW,
}

export enum LocationType {
  BOSS,
}

export enum DungeonType {
  CATACOMBS,
  CAVE,
  HEROS_GRAVE,
  TUNNEL,
  GAOL,
  GROTTO,
  EVERGAOL,
  PRECIPICE,
  RUINS,
  FORGE,
  OTHER,
}
