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
  category: string
  npcs: Npc[]
  youtube: string
}

export type ResistanceValue = number | 'Immune'

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
  rot: ResistanceValue
  bleed: ResistanceValue
  frost: ResistanceValue
  madness: ResistanceValue
  sleep: ResistanceValue
  deathblight: ResistanceValue
}

export interface Poise {
  base: number
  mult: number
  effective: number
  regenerationDelay: number
}

export interface Npc {
  id?: number
  flagId: number
  name: string
  phase: number
  tarnished: boolean
  weakPart: number
  parryable: boolean
  numberOfParries: number
  backstab: boolean
  negation: Negation
  resistance: Resistance
  poise: Poise
}
