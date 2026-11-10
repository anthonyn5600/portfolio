import type { ComponentType } from 'react'
import CampusNav from './campus/CampusNav'
import PipelineHero from './pipeline/PipelineHero'

// Every demo the site can mount, by the name used in data-demo="…", with the
// width of the slot it is designed for (shown 1:1 at that width).
export const DEMOS: Record<string, { component: ComponentType; width: number; card?: boolean }> = {
  pipeline: { component: PipelineHero, width: 620 },
  campus: { component: CampusNav, width: 448, card: true },
}
