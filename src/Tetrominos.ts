import { ColorSet } from './ColorSets'

export type PieceData = Array<Array<boolean>>

export type Piece = {
  colors: Array<string>
  data: PieceData
}

export function createTetrominos(colorSet: ColorSet): Array<Piece> {
  return [
    {
      // box
      colors: colorSet.square,
      data: [
        [false, false, false, false],
        [false, true, true, false],
        [false, true, true, false],
        [false, false, false, false]
      ]
    },
    {
      // stick
      colors: colorSet.straight,
      data: [
        [false, false, false, false],
        [false, false, false, false],
        [true, true, true, true],
        [false, false, false, false]
      ]
    },
    {
      // z
      colors: colorSet.z,
      data: [
        [false, false, false, false],
        [false, true, true, false],
        [false, false, true, true],
        [false, false, false, false]
      ]
    },
    {
      // T
      colors: colorSet.t,
      data: [
        [false, false, false, false],
        [false, true, true, true],
        [false, false, true, false],
        [false, false, false, false]
      ]
    },
    {
      // s
      colors: colorSet.s,
      data: [
        [false, false, false, false],
        [false, true, true, false],
        [true, true, false, false],
        [false, false, false, false]
      ]
    },
    {
      // backwards L
      colors: colorSet.j,
      data: [
        [false, false, true, false],
        [false, false, true, false],
        [false, true, true, false],
        [false, false, false, false]
      ]
    },
    {
      // L
      colors: colorSet.l,
      data: [
        [false, true, false, false],
        [false, true, false, false],
        [false, true, true, false],
        [false, false, false, false]
      ]
    }
  ]
}
