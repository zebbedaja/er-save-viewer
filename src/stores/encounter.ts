import { defineStore } from 'pinia'
import { encounters } from '@/model/encounters'
import type { ProcessedEncounter } from '@/model/types'
import { hasDuoPhase, hasMultiplePhases } from '@/util'

const processedEncounters: ProcessedEncounter[] = encounters.map((e) => ({
  ...e,
  level: e.npcs[0]?.level ?? null,
  hasGreatRune: e.drops.some((d) => /Great Rune/.test(d)),
  hasRemembrance: e.drops.some((d) => /Remembrance/.test(d)),
  hasParryable: e.npcs.some((n) => n.parryable),
  hasHuman: e.npcs.some((n) => n.human),
  hasDuoPhase: hasDuoPhase(e.npcs),
  hasMultiplePhases: hasMultiplePhases(e.npcs),
  hasVoid: e.npcs.some((n) => n.void),
  hasDragon: e.npcs.some((n) => n.dragon),
  hasAncientDragon: e.npcs.some((n) => n.ancientDragon),
  hasUndead: e.npcs.some((n) => n.undead),
  hasThoseWhoLiveInDeath: e.npcs.some((n) => n.thoseWhoLiveInDeath),
  hasBackstab: e.npcs.some((n) => n.backstab),
}))

export const useEncounterStore = defineStore('encounter', () => {
  function getByFlagId(id: number): ProcessedEncounter | undefined {
    return processedEncounters.find((e) => e.flagId === id)
  }

  return {
    encounters: processedEncounters,
    getByFlagId,
  }
})
