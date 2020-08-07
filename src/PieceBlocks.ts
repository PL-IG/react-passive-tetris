import { PieceData } from './Tetrominos'

import { Colors } from './Colors'
import { SectionPercentages } from './Dimensions'

export async function forEachPieceBlock(
    data: PieceData,
    perform: (x: number, y: number) => void
) {
    for (var x = 0; x < data.length; x++) {
        for (var y = 0; y < data[x].length; y++) {
            if (data[x][y] === true) {
                perform(x, y)
            }
        }
    }
}

export async function renderPieceBlock(
    x: number,
    y: number,
    unitSize: number,
    colors: Colors,
    sectionPercentages: SectionPercentages,
    context: CanvasRenderingContext2D
) {
    if (sectionPercentages.outer > 0) {
        context.fillStyle = colors[0]
        context.fillRect(x, y, unitSize, unitSize)
    }

    if (unitSize >= 3) {
        context.fillStyle = colors[1]

        const outerMargin = (unitSize / 2) * sectionPercentages.outer
        context.fillRect(
            x + outerMargin,
            y + outerMargin,
            unitSize - outerMargin * 2,
            unitSize - outerMargin * 2
        )

        if (unitSize >= 7) {
            context.fillStyle = colors[2]

            const mediumMargin = (unitSize / 2) * sectionPercentages.middle
            context.fillRect(
                x + outerMargin + mediumMargin,
                y + outerMargin + mediumMargin,
                unitSize - (outerMargin * 2 + mediumMargin * 2),
                unitSize - (outerMargin * 2 + mediumMargin * 2)
            )
        }
    }
}

export async function renderPieceBlocks(
    xPosition: number,
    yPosition: number,
    unitSize: number,
    data: PieceData,
    colors: Colors,
    sectionPercentages: SectionPercentages,
    context: CanvasRenderingContext2D
) {
    forEachPieceBlock(data, (x, y) => {
        var xPos = (x + xPosition) * unitSize
        var yPos = (y + yPosition) * unitSize

        if (yPos > -1) {
            renderPieceBlock(
                xPos,
                yPos,
                unitSize,
                colors,
                sectionPercentages,
                context
            )
        }
    })
}