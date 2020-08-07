import { Dimensions } from './Dimensions'
import { NoBlockPresent } from './Constants'

export type BoardSpot = {
    pieceBlockPresent: boolean
    colors?: Array<string>
}

export function createBoard(dimensions: Dimensions): Array<Array<BoardSpot>> {
    var board: Array<Array<BoardSpot>> = []

    for (var x = 0; x <= dimensions.width; x++) {
        board[x] = []
        for (var y = 0; y <= dimensions.height; y++) {
            board[x][y] = {
                pieceBlockPresent: false,
                colors: NoBlockPresent
            }
        }
    }

    return board
}