import type { MapDiffData } from './mapType'

export enum Compare {
  LESS, EQUAL, GREATER, INDETERMINATE
}

export function compareDiff(a: MapDiffData, b: MapDiffData): number {
  const dH = compareDiffSingle(a.hard, b.hard)
  const dN = compareDiffSingle(a.normal, b.normal)
  const dE = compareDiffSingle(a.easy, b.easy)

  if (dH === Compare.EQUAL) {
    if (dN === Compare.EQUAL) {
      return cmpToNumber(nonIndeterminate(dE, dN, dH))
    }
    return cmpToNumber(nonIndeterminate(dN, dH))
  }
  return cmpToNumber(nonIndeterminate(dH))
}

function cmpToNumber(cmp: Compare) {
  if (cmp === Compare.LESS) return -1
  if (cmp === Compare.EQUAL) return 0
  if (cmp === Compare.GREATER) return 1
  throw new Error('RESULT_IS_INDETERMINATE')
}

function nonIndeterminate(...args: Array<Compare>) {
  for (const a of args) {
    if (a !== Compare.INDETERMINATE) return a;
  }
  throw new Error('ALL_IS_INDETERMINATE')
}

function compareDiffSingle(a: string, b: string): Compare {
  const compare = removeNullDiff(a, b)
  if (compare !== Compare.INDETERMINATE) return compare

  const diff_a = +a.toString().replace('+', '.5')
  const diff_b = +b.toString().replace('+', '.5')

  if (diff_a < diff_b) return Compare.LESS
  if (diff_a === diff_b) return Compare.EQUAL
  if (diff_a > diff_b) return Compare.GREATER
  return Compare.INDETERMINATE
}

function removeNullDiff(a: string, b: string): Compare {
  if ((!a || a === "-") && (!b || b === "-")) return Compare.INDETERMINATE
  if (!a || a === "-") return Compare.LESS
  if (!b || b === "-") return Compare.GREATER
  return Compare.INDETERMINATE
}