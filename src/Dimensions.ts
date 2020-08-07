export type Dimensions = {
  width: number
  height: number
}

export interface SectionPercentages {
  // Inner will always eat up the remainder
  outer: number
  middle: number
}
