import { CommandModule } from 'yargs'
import chalk from 'chalk'
import figures from 'figures'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
}

class BingoGame {
    calls: number[]
    boards: Board[]
    step = 0

    constructor(boards: Board[], calls: number[]) {
        this.boards = boards
        this.calls = calls
    }

    public run(): Board[] {
        while (this.getBingos().length == 0) {
            this.runStep()
        }
        return this.getBingos()
    }

    public runStep(): void {
        this.boards.forEach((board) => {
            board.markCells(this.calls[this.step])
        })
        this.step += 1
    }

    public runAll(): void {
        this.calls.forEach(() => this.runStep())
    }

    public getBingos(): Board[] {
        const boards: Board[] = []
        this.boards.forEach((board) => {
            if (board.checkBingo()) boards.push(board)
        })
        return boards
    }
}

interface Cell {
    value: number
    marked: boolean
}

class Board {
    cells: Cell[][]

    constructor(cells: Cell[][]) {
        this.cells = cells
    }

    public markCells(value: number): void {
        this.cells.forEach((row) => {
            row.forEach((cell) => {
                if (cell.value == value) {
                    cell.marked = true
                }
            })
        })
    }

    public checkBingo(): boolean {
        // consider board to be square
        for (let i = 0; i < this.cells.length; i++) {
            if (this.checkRow(i) || this.checkCol(i)) return true
        }
        return false
    }

    private checkRow(position: number): boolean {
        const marked = this.cells[position].filter((cell) => cell.marked)
        return marked.length == this.cells[position].length
    }

    private checkCol(position: number): boolean {
        const col = this.cells.map((row) => row[position])
        const marked = col.filter((cell) => cell.marked)
        return marked.length == col.length
    }

    public print(): void {
        // get longest value
        const biggest = Math.max(...this.cells.flat().map((cell) => cell.value))
        const chars = biggest.toString().length

        const rows: string[] = []
        this.cells.forEach((row) => {
            rows.push(
                row
                    .map((cell) => {
                        const value = cell.value.toString().padStart(chars, ' ')
                        if (cell.marked) return chalk.bold.blue(value)
                        return value
                    })
                    .join(' ')
            )
        })
        console.log(rows.join('\n'))
    }

    public getUnmarkedSum(): number {
        return this.cells
            .flat()
            .filter((cell) => !cell.marked)
            .map((cell) => cell.value)
            .reduce((a, b) => a + b)
    }
}

const title = 'Day 4: Giant Squid'

const dayFourCommand: CommandModule = {
    describe: title,
    command: 'day-4 <input>',
    builder: (yargs) =>
        yargs.strict().positional('input', {
            description:
                'the bingo setup, first line containing calls seperated by comma',
            type: 'string',
        }),

    handler: async (args) => {
        const { input } = (args as unknown) as CommandOptions
        const game = await readInput(input)

        console.log(chalk.bold(`-- ${title} --\n`))
        console.log(chalk.bold('-- Part One --'))
        partOne(game)

        // console.log(chalk.bold('-- Part Two --'))
    },
}

const partOne = (game: BingoGame): void => {
    const bingos = game.run()
    bingos.forEach((board) => {
        board.print()
        console.log('\n')
        printScore(game.calls[game.step - 1], board.getUnmarkedSum())
        console.log('\n')
    })
}

const readInput = async (fPath: string): Promise<BingoGame> => {
    const buffer = await filehandle.readFile(fPath)
    const split = buffer.toString().split('\n\n')
    const game: BingoGame = new BingoGame(
        parseBoards(split.slice(1)),
        split[0].split(',').map((call) => parseInt(call, 10))
    )
    return game
}

const parseBoards = (boardStr: string[]): Board[] => {
    return boardStr.map((str) => {
        return new Board(str.split('\n').map((row) => parseRow(row)))
    })
}

const parseRow = (row: string): Cell[] => {
    return row
        .split(' ')
        .filter((value) => value != '')
        .map((value) => {
            return { value: parseInt(value), marked: false }
        })
}

const printScore = (call: number, unmarked: number): void => {
    const unmarkedStr = chalk.blue(chalk.bold(figures.cross) + ' ' + unmarked)
    const stepStr = chalk.cyan(chalk.bold(figures.arrowRight + ' ' + call))
    const score = chalk.magenta(chalk.bold('∏') + ' ' + unmarked * call)
    console.log(`${unmarkedStr} ${stepStr} ${score}`)
}

export default dayFourCommand
