import { CommandModule } from 'yargs'
import chalk from 'chalk'
import figures from 'figures'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
}

class Diagram {
    lines: Line[]
    matrix: number[][]

    constructor(lines: Line[], diagonals = false) {
        this.lines = lines
        this.matrix = this.generateMatrix(diagonals)
    }

    public countOverlaps(): number {
        return this.matrix.flat().filter((value) => value >= 2).length
    }

    private generateMatrix(diagonals = false): number[][] {
        const maxX = Math.max(
            ...this.lines.map((line) => [line.start.x, line.end.x]).flat()
        )
        const maxY = Math.max(
            ...this.lines.map((line) => [line.start.y, line.end.y]).flat()
        )

        const matrix: number[][] = new Array(maxY + 1)
            .fill(null)
            .map(() => Array(maxX + 1).fill(0))

        this.lines.forEach((line) => {
            line.getPoints(diagonals).forEach((point) => {
                matrix[point.y][point.x] += 1
            })
        })

        return matrix
    }

    public draw(): void {
        this.matrix.forEach((row) => console.log(row.join('')))
    }
}

class Line {
    start: Point
    end: Point

    constructor(start: Point, end: Point) {
        this.start = start
        this.end = end
    }

    public getPoints(diagonals = false): Point[] {
        const points: Point[] = []
        if (this.start.x == this.end.x) {
            const startY = this.start.y < this.end.y ? this.start.y : this.end.y
            const endY = this.start.y < this.end.y ? this.end.y : this.start.y
            for (let i = startY; i <= endY; i++) {
                points.push({ x: this.start.x, y: i })
            }
        } else if (this.start.y == this.end.y) {
            const startX = this.start.x < this.end.x ? this.start.x : this.end.x
            const endX = this.start.x < this.end.x ? this.end.x : this.start.x
            for (let i = startX; i <= endX; i++) {
                points.push({ x: i, y: this.start.y })
            }
        } else if (diagonals) {
            const numPoints = Math.abs(this.start.x - this.end.x) + 2
            let { x, y } = this.start
            for (let i = 0; i < numPoints - 1; i++) {
                if (this.start.x > this.end.x) {
                    x = this.start.x - i
                } else if (this.start.x < this.end.x) {
                    x = this.start.x + i
                }
                if (this.start.y > this.end.y) {
                    y = this.start.y - i
                } else if (this.start.y < this.end.y) {
                    y = this.start.y + i
                }

                points.push({ x, y })
            }
        }
        return points
    }
}

interface Point {
    x: number
    y: number
}

const title = 'Day 5: Hydrothermal Venture'

const dayFiveCommand: CommandModule = {
    describe: title,
    command: 'day-5 <input>',
    builder: (yargs) =>
        yargs.strict().positional('input', {
            description: 'lines of vents, one per line',
            type: 'string',
        }),

    handler: async (args) => {
        const { input } = (args as unknown) as CommandOptions
        const lines = await readInput(input)

        console.log(chalk.bold(`-- ${title} --\n`))
        console.log(chalk.bold('-- Part One --'))
        partOne(lines)

        console.log('\n')
        console.log(chalk.bold('-- Part Two --'))
        partTwo(lines)
    },
}

const partOne = (lines: Line[]): void => {
    const diagram = new Diagram(lines)
    console.log(
        chalk.blue(chalk.bold(figures.cross) + ' ' + diagram.countOverlaps())
    )
}

const partTwo = (lines: Line[]): void => {
    const diagram = new Diagram(lines, true)
    console.log(
        chalk.blue(chalk.bold(figures.cross) + ' ' + diagram.countOverlaps())
    )
}

const readInput = async (fPath: string): Promise<Line[]> => {
    const buffer = await filehandle.readFile(fPath)
    const lines = buffer.toString().split('\n')
    return lines.map((line) => parseLine(line))
}

const parseLine = (line: string): Line => {
    const points = line.split(' -> ')
    const start = points[0].split(',').map((coord) => parseInt(coord, 10))
    const end = points[1].split(',').map((coord) => parseInt(coord, 10))
    return new Line({ x: start[0], y: start[1] }, { x: end[0], y: end[1] })
}

export default dayFiveCommand
