import React, { Component } from 'react'

import { ColorSet, DefaultColorSet, BlackAndWhiteColorSet } from './ColorSets'
import { PieceData, Piece, createTetrominos } from './Tetrominos'

import { Dimensions, SectionPercentages } from './Dimensions'
import { BoardSpot, createBoard } from './Board'
import { NoBlockPresent } from './Constants'
import {
  forEachPieceBlock,
  renderPieceBlocks,
  renderPieceBlock
} from './PieceBlocks'

type Props = {
  colorSet?: ColorSet

  sectionPercentages?: SectionPercentages

  unitSize?: number
  timeStepLength?: number

  typesOfPieces?: Array<Piece>
}

type CurrentPiece = {
  data: PieceData | null
  colors: Array<string>
  x: number
  y: number
}

export const DefaultSectionPercentages: SectionPercentages = {
  outer: 0.33,
  middle: 0.33
}

// originally based on https://codepen.io/loktar00/pen/hGJBg by Loktar (http://www.somethinghitme.com/)
class PassiveTetris extends Component<Props> {
  static defaultColorSet = DefaultColorSet
  static blackAndWhiteColorSet = BlackAndWhiteColorSet

  static defaultSectionPercentages = DefaultSectionPercentages

  static defaultTimeStepLength = () => {
    return 50 + Math.random() * 50
  }

  static defaultUnitSize = 20

  foregroundRef: React.RefObject<HTMLCanvasElement>
  foregroundContext: CanvasRenderingContext2D | null = null
  backgroundRef: React.RefObject<HTMLCanvasElement>
  backgroundContext: CanvasRenderingContext2D | null = null

  currentPiece: CurrentPiece
  lastMove: number
  timeStepLength: number
  unitSize: number
  linesCleared: number
  level: number

  typesOfPieces: Array<Piece>

  board: Array<Array<BoardSpot>> | null = null
  boardDimensions: Dimensions | null = null

  animationFrameId: number | null = null
  animationFrameUpdate: (() => void) | null = null

  constructor(props: Props) {
    super(props)

    this.typesOfPieces =
      props.typesOfPieces || createTetrominos(props.colorSet || DefaultColorSet)

    this.foregroundRef = React.createRef()
    this.backgroundRef = React.createRef()

    this.currentPiece = {
      data: null,
      colors: NoBlockPresent,
      x: 0,
      y: 0
    }

    this.lastMove = Date.now()
    this.timeStepLength =
      props.timeStepLength || PassiveTetris.defaultTimeStepLength()
    this.unitSize = props.unitSize || PassiveTetris.defaultUnitSize
    this.linesCleared = 0
    this.level = 0
  }

  componentDidUpdate(previousProps: Props) {
    if (
      previousProps.colorSet !== this.props.colorSet ||
      previousProps.typesOfPieces !== this.props.typesOfPieces
    ) {
      this.typesOfPieces =
        this.props.typesOfPieces ||
        createTetrominos(this.props.colorSet || DefaultColorSet)
    }

    if (previousProps.timeStepLength !== this.props.timeStepLength) {
      this.timeStepLength =
        this.props.timeStepLength || PassiveTetris.defaultTimeStepLength()
    }

    if (previousProps.unitSize !== this.props.unitSize) {
      this.unitSize = this.props.unitSize || PassiveTetris.defaultUnitSize

      this.resize()
    }
  }

  reset() {
    if (!this.boardDimensions) {
      throw new Error('Board dimensions not set, unable to reset')
    }
    this.board = createBoard(this.boardDimensions)

    this.checkLines()
    this.renderBackground()

    this.newPiece()
  }

  static getDimensions(
    canvasReference: React.RefObject<HTMLCanvasElement>
  ): Dimensions | undefined {
    if (!canvasReference || !canvasReference.current) {
      return undefined
    }
    const width = canvasReference.current.clientWidth
    const height = canvasReference.current.clientHeight

    return {
      width,
      height
    }
  }

  componentDidMount() {
    if (this.foregroundRef.current) {
      this.foregroundContext = this.foregroundRef.current.getContext('2d')
    }
    if (this.backgroundRef.current) {
      this.backgroundContext = this.backgroundRef.current.getContext('2d')
    }

    this.resize()

    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this))
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
  }

  resize() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }

    const dimensions = PassiveTetris.getDimensions(this.foregroundRef)
    if (!dimensions) {
      return
    }

    if (this.foregroundRef.current) {
      this.foregroundRef.current.width = dimensions.width
      this.foregroundRef.current.height = dimensions.height
    }
    if (this.backgroundRef.current) {
      this.backgroundRef.current.width = dimensions.width
      this.backgroundRef.current.height = dimensions.height
    }

    this.boardDimensions = {
      width: Math.floor(dimensions.width / this.unitSize),
      height: Math.floor(dimensions.height / this.unitSize)
    }

    this.reset()

    this.update()
  }

  // TODO: use passed delta time
  update() {
    var currentPiece = this.currentPiece

    if (!this.checkMovement(currentPiece, 0, 1)) {
      if (currentPiece.y < -1) {
        this.reset()
      } else {
        this.addPieceToPile(currentPiece)
        this.newPiece()
      }
    } else {
      if (Date.now() > this.lastMove) {
        this.lastMove = Date.now() + this.timeStepLength
        if (this.checkMovement(currentPiece, 0, 1)) {
          currentPiece.y++
        } else {
          this.addPieceToPile(currentPiece)
          this.newPiece()
        }
      }
    }

    this.renderCanvas()

    if (!this.animationFrameUpdate) {
      this.animationFrameUpdate = this.update.bind(this)
    }
    this.animationFrameId = requestAnimationFrame(this.animationFrameUpdate)
  }

  // TODO: optimize to only rerender and clear if and when necessary
  renderBackground() {
    const { sectionPercentages: PropsSectionPercentages } = this.props
    const sectionPercentages =
      PropsSectionPercentages || PassiveTetris.defaultSectionPercentages

    const canvas = this.backgroundRef.current
    const ctx = this.backgroundContext
    const unitSize = this.unitSize
    const board = this.board

    if (!ctx) {
      console.log('Error: background context not available')
      return
    }
    if (!canvas) {
      console.log('Error: background canvas not available')
      return
    }

    if (!board) {
      console.log('Error: board is not available')
      return
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    forEachPieceBlock(
      board.map(value => value.map(value => value.pieceBlockPresent)),
      (x, y) => {
        var bX = x * unitSize
        var bY = y * unitSize

        const colors = board[x][y].colors
        if (!colors) {
          return
        }
        renderPieceBlock(bX, bY, unitSize, colors, sectionPercentages, ctx)
      }
    )
  }

  // Render the current active piece
  renderCanvas() {
    const { sectionPercentages: PropsSectionPercentages } = this.props
    const sectionPercentages =
      PropsSectionPercentages || PassiveTetris.defaultSectionPercentages

    const canvas = this.foregroundRef.current
    const ctx = this.foregroundContext
    const unitSize = this.unitSize
    const currentPiece = this.currentPiece
    if (!ctx) {
      console.log('Error: foreground context not available')
      return
    }
    if (!canvas) {
      console.log('Error: foreground canvas not available')
      return
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const data = currentPiece.data
    if (!data) {
      return
    }

    renderPieceBlocks(
      currentPiece.x,
      currentPiece.y,
      unitSize,
      data,
      currentPiece.colors,
      sectionPercentages,
      ctx
    )
  }

  newPiece() {
    if (!this.boardDimensions) {
      throw new Error('Board dimensions not set, unable to create new piece')
    }
    var pieceNumber = Math.floor(Math.random() * this.typesOfPieces.length)

    this.currentPiece.data = this.typesOfPieces[pieceNumber].data
    this.currentPiece.colors = this.typesOfPieces[pieceNumber].colors
    this.currentPiece.x = Math.floor(
      Math.random() *
        (this.boardDimensions.width - this.currentPiece.data.length + 1)
    )
    this.currentPiece.y = -4
  }

  static forEachBlockInPiece(
    piece: CurrentPiece,
    perform: (x: number, y: number) => void
  ) {
    if (!piece.data) {
      return
    }
    forEachPieceBlock(piece.data, perform)
  }

  addPieceToPile(piece: CurrentPiece) {
    const board = this.board
    if (!board) {
      throw new Error('Board not set up, unable to add Piece to Pile')
    }
    PassiveTetris.forEachBlockInPiece(piece, (x, y) => {
      board[x + piece.x][y + piece.y].pieceBlockPresent = true
      board[x + piece.x][y + piece.y].colors = piece.colors
    })

    this.checkLines()
    this.renderBackground()
  }

  checkMovement(piece: CurrentPiece, newX: number, newY: number) {
    const board = this.board
    const boardDimensions = this.boardDimensions
    if (!board || !boardDimensions) {
      throw new Error('Board not set up, check Piece movement')
    }

    var moveOk = true
    PassiveTetris.forEachBlockInPiece(piece, (x, y) => {
      if (!board[piece.x + x + newX]) {
        board[piece.x + x + newX] = []
      }

      if (!board[piece.x + x + newX][y + piece.y + newY]) {
        board[piece.x + x + newX][y + piece.y + newY] = {
          pieceBlockPresent: false
        }
      }

      if (
        piece.x + x + newX >= boardDimensions.width ||
        piece.x + x + newX < 0 ||
        board[piece.x + x + newX][y + piece.y + newY].pieceBlockPresent === true
      ) {
        moveOk = false
      }

      if (piece.y + y + newY > boardDimensions.height) {
        moveOk = false
      }
    })
    return moveOk
  }

  checkLines() {
    const board = this.board
    const boardDimensions = this.boardDimensions
    if (!board || !boardDimensions) {
      throw new Error('Board not set up, check Piece movement')
    }

    var linesCleared = this.linesCleared
    var y = boardDimensions.height + 1

    while (y--) {
      var x = boardDimensions.width
      var lines = 0

      while (x--) {
        if (board[x][y].pieceBlockPresent === true) {
          lines++
        }
      }

      if (lines === boardDimensions.width) {
        linesCleared++
        this.level = Math.round(linesCleared / 20) * 20

        var lineY = y
        while (lineY) {
          for (x = 0; x <= boardDimensions.width; x++) {
            if (lineY - 1 > 0) {
              board[x][lineY].pieceBlockPresent =
                board[x][lineY - 1].pieceBlockPresent
              board[x][lineY].colors = board[x][lineY - 1].colors
            }
          }
          lineY--
        }
        y++
      }
    }
  }

  rotatePiece(currentPiece: CurrentPiece) {
    var rotated = []

    if (!currentPiece.data) {
      return
    }

    for (var x = 0; x < currentPiece.data.length; x++) {
      rotated[x] = new Array<boolean>()
      for (var y = 0; y < currentPiece.data[x].length; y++) {
        rotated[x][y] = currentPiece.data[3 - y][x]
      }
    }

    if (
      !this.checkMovement(
        {
          data: rotated,
          x: currentPiece.x,
          y: currentPiece.y,
          colors: NoBlockPresent
        },
        0,
        0
      )
    ) {
      rotated = currentPiece.data
    }

    return rotated
  }

  randomlyFill() {
    const board = this.board
    const boardDimensions = this.boardDimensions
    if (!board || !boardDimensions) {
      throw new Error('Board not set up, check Piece movement')
    }
    var halfHeight = boardDimensions.height / 2

    for (var x = 0; x <= boardDimensions.width; x++) {
      for (var y = 0; y <= boardDimensions.height; y++) {
        if (Math.random() > 0.15 && y > halfHeight) {
          board[x][y] = {
            pieceBlockPresent: true,
            colors: this.typesOfPieces[
              Math.floor(Math.random() * this.typesOfPieces.length)
            ].colors
          }
        }
      }
    }

    // collapse the board a bit
    for (x = 0; x <= boardDimensions.width; x++) {
      for (y = boardDimensions.height - 1; y > -1; y--) {
        if (board[x][y].pieceBlockPresent === false && y > 0) {
          for (var yy = y; yy > 0; yy--) {
            if (board[x][yy - 1].pieceBlockPresent) {
              board[x][yy].pieceBlockPresent = true
              board[x][yy].colors = board[x][yy - 1].colors

              board[x][yy - 1].pieceBlockPresent = false
              board[x][yy - 1].colors = NoBlockPresent
            }
          }
        }
      }
    }
  }

  render() {
    const style: React.CSSProperties = {
      position: 'relative',

      height: '100%',
      width: '100%'
    }
    const canvasStyle: React.CSSProperties = {
      position: 'absolute',

      margin: 0,
      padding: 0,

      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }
    return (
      <div style={style}>
        <canvas style={canvasStyle} ref={this.foregroundRef} />
        <canvas style={canvasStyle} ref={this.backgroundRef} />
      </div>
    )
  }
}
//

export default PassiveTetris
